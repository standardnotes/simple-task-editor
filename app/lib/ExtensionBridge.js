import TaskParser from "./TaskParser"
import Group from "../models/Group"
import ComponentManager from 'sn-components-api';

export default class ExtensionBridge {

  /* Singleton */
  static instance = null;
  static get() {
    if (this.instance == null) { this.instance = new ExtensionBridge(); }
    return this.instance;
  }

  constructor() {
    this.dataString = "";
  }

  initiateBridge() {
    var permissions = [{name: "stream-context-item"}];

    this.componentManager = new ComponentManager(permissions, () => {
      // on ready
      this.onReady && this.onReady();
    });

    this.componentManager.streamContextItem((note) => {
      this.note = note;

      if(note.isMetadataUpdate) {
        return;
      }

      this.dataString = note.content.text;
      this.unsavedTask = note.content.unsavedTask;
      this.reloadData();
      this.dataChangeHandler && this.dataChangeHandler(this.tasks);
    });
  }

  getPlatform() {
    return this.componentManager.platform;
  }

  isMobile() {
    return this.componentManager && this.componentManager.environment == "mobile";
  }

  setOnReady(onReady) {
    this.onReady = onReady;
  }

  setDataChangeHandler(handler) {
    this.dataChangeHandler = handler;
  }

  reloadData() {
    this.groups = TaskParser.createGroupsFromText(this.dataString);
    console.log("Got groups", this.groups);
  }

  getGroups() {
    if(!this.groups) {
      this.reloadData();
    }
    return this.groups;
  }

  // buildHtmlPreview() {
  //   var openTasks = this.categorizedTasks.openTasks;
  //   var completedTasks = this.categorizedTasks.completedTasks;
  //   var totalLength = openTasks.length + completedTasks.length;
  //
  //   var taskPreviewLimit = 3;
  //   var tasksToPreview = Math.min(openTasks.length, taskPreviewLimit);
  //
  //   var html = "<div>";
  //   html += `<div style="margin-top: 8px;"><strong>${completedTasks.length}/${totalLength} tasks completed</strong></div>`;
  //   html += `<progress max="100" style="margin-top: 10px; width: 100%;" value="${(completedTasks.length/totalLength) * 100}"></progress>`;
  //
  //   if(tasksToPreview > 0) {
  //     html += "<ul style='padding-left: 19px; margin-top: 10px;'>";
  //     for(var i = 0; i < tasksToPreview; i++) {
  //       var task = openTasks[i];
  //       html += `<li style='margin-bottom: 6px;'>${task.content}</li>`
  //     }
  //     html += "</ul>";
  //
  //     if(openTasks.length > tasksToPreview) {
  //       var diff = openTasks.length - tasksToPreview;
  //       var noun = diff == 1 ? "task" : "tasks";
  //       html += `<div><strong>And ${diff} other open ${noun}.</strong></div>`
  //     }
  //   }
  //
  //   html += "</div>"
  //
  //   return html;
  // }
  //
  // buildPlainPreview() {
  //   var openTasks = this.categorizedTasks.openTasks;
  //   var completedTasks = this.categorizedTasks.completedTasks;
  //   var totalLength = openTasks.length + completedTasks.length;
  //
  //   var taskPreviewLimit = 1;
  //   var tasksToPreview = Math.min(openTasks.length, taskPreviewLimit);
  //
  //   var plain = "";
  //   plain += `${completedTasks.length}/${totalLength} tasks completed.`;
  //
  //   return plain;
  // }

  save() {
    this.dataString = Group.stringRepresentationForGroups(this.groups);

    if(this.note) {
      // Be sure to capture this object as a variable, as this.note may be reassigned in `streamContextItem`, so by the time
      // you modify it in the presave block, it may not be the same object anymore, so the presave values will not be applied to
      // the right object, and it will save incorrectly.
      let note = this.note;
      this.componentManager.saveItemWithPresave(note, () => {
        // required to build dynamic previews
        note.content.text = this.dataString;
        note.content.unsavedTask = this.unsavedTask;
        // note.content.preview_html = this.buildHtmlPreview();
        // note.content.preview_plain = this.buildPlainPreview();
        note.content.preview_plain = this.dataString;
      });
    }
  }
}
