import Task from "../models/Task";
import Group from "../models/Group";
import ComponentManager from 'sn-components-api';

let TaskDelimitter = "\n";

// Requires two hashes start of line followed by any number of non new line characters
let GroupRegex = /^##.*/

export default class TaskParser {

  static needsMigration(text) {
    return true;
  }

  static migrateLegacyTextToGroupBasedText(legacyText) {
    /*
    Legacy text did not use header structure, and is a flat list of tasks.
    We can detect legacy text if we don't find a reference of "##GroupName"
    */
  }

  static createGroupsFromText(text) {
    /*
    Groups are made from ##GroupName segments in a string.
    Groups look like:

    ##GroupA
    - [ ] Task 1
    - [ ] Task 2
    - [x] Task 3
    ##GroupB
    ||  Unsaved task typed but not submitted
    - [ ] Task 1
    - [ ] Task 2
    - [x] Task 3

    Subgroups are not supported.
    */

    const tasksForComponent = (component) => {
      let taskStrings = component.split(TaskDelimitter);
      return taskStrings.filter((s) => {return s.replace(/ /g, '').length > 0}).map((rawString) => {
        return new Task(rawString);
      });
    }

    let groupComponents = text.split(GroupRegex);

    if(groupComponents.length == 0 || (groupComponents.length == 1 && groupComponents[0] == text)) {
      // If no group matches are found, create a default section with the text
      let tasks = tasksForComponent(text);
      let defaultGroup = new Group("Default", tasks);
      return [defaultGroup];
    }

    let groups = [];
    let handledComponents = [];
    let index = 0;
    // We must have found at least one section.
    for(let index = 0; index <= groupComponents.length;) {
      let component = groupComponents[index];
      handledComponents.push(component);
      let tasks;
      if(GroupRegex.test(component)) {
        // Is group, next component should be tasks.
        let taskComponent = groupComponents[index + 1];
        handledComponents.push(taskComponent);
        if(GroupRegex.test(taskComponent)) {
          // Is another group, which means our current group has no items.
          tasks = [];
          // Increment only by one as the next group needs to be handled by the next loop
          index++;
        } else {
          tasks = tasksForComponent(taskComponent);
          // Increment by two since we've already handled the next index.
          index += 2;
        }

        let group = new Group(component, tasks);
        groups.push(group);
      } else {
        // Isn't group, if hasn't been handled yet, create empty group.
        if(!handledComponents.includes(component)) {
          // This should only be the case if we have groups, but the first section isn't in a group
          let tasks = tasksForComponent(component);
          groups.push(new Group("Default", tasks));
        }
        index++;
      }
    }

    return groups;
  }


}
