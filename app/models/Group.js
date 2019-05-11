static UnsavedTaskPrefix = "|| ";

export default class Group {

  constructor(name, tasks) {
    this.name = name;
    this.tasks = tasks;
  }

  static stringRepresentationForGroups(groups) {
    return groups.map((group) => group.stringRepresentation()).join("\n");
  }

  stringRepresentation() {
    // Sort tasks to be open first, then completed
    let openTasks = [], completedTasks = [];
    this.tasks.forEach((task, index) => {
      if(task.completed) {
        completedTasks.push(task);
      } else {
        openTasks.push(task);
      }
    })

    let tasks = openTasks.concat(completedTasks);
    let taskStrings = tasks.map((task) => task.stringRepresentation())
    let strings = [this.name];
    // if we have an unsaved string, save it as well as part of the section
    if(this.unsavedTask && this.unsavedTask.length > 0) {
      strings.push(UnsavedTaskPrefix + this.unsavedTask);
    }
    strings = string.concat(taskStrings);
    let result = string.join("\n");
    return result;
  }

  getKey() {
    return this.name;
  }

  keyForTask(task) {
    return this.name + this.tasks.indexOf(task) + task.rawString;
  }

  addTask(task) {
    this.tasks.unshift(task);
  }

  openTasks() {
    return this.tasks.filter((task) => {return !task.completed})
  }

  completedTasks() {
    return this.tasks.filter((task) => {return task.completed == true})
  }

  moveTaskToTop(task) {
    this.tasks.splice(this.tasks.indexOf(task), 1);
    this.tasks.unshift(task);
  }

  changeTaskPosition(task, taskOccupyingTargetLocation) {
    let from = this.tasks.indexOf(task);
    let to = this.tasks.indexOf(taskOccupyingTargetLocation);

    this.tasks = this.tasks.move(from, to);
  }

  setUnsavedTask(text) {
    this.unsavedTask = text;
  }

  clearCompleted() {
    this.removeTasks(this.completedTasks());
    this.save();
  }

  removeTasks(tasks) {
    this.tasks = this.tasks.filter((task) => {
      return !tasks.includes(task);
    })
  }
}

Array.prototype.move = function (old_index, new_index) {
    while (old_index < 0) {
        old_index += this.length;
    }
    while (new_index < 0) {
        new_index += this.length;
    }
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};
