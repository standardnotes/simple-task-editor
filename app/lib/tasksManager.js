import Task from "../models/Task";
import ComponentManager from 'sn-components-api';

let TaskDelimitter = "\n";

export default class TasksManager {

  /* Singleton */
  static instance = null;
  static get() {
    if (this.instance == null) { this.instance = new TasksManager(); }
    return this.instance;
  }

  constructor() {
    this.initiateBridge();
  }

  initiateBridge() {
    var permissions = [
      {
        name: "stream-context-item"
      }
    ]

    this.componentManager = new ComponentManager(permissions, function(){
      // on ready
    });

    this.componentManager.streamContextItem((note) => {
      this.note = note;

      if(note.isMetadataUpdate) {
        return;
      }

      this.dataString = note.content.text;
      this.reloadData();
      this.dataChangeHandler && this.dataChangeHandler(this.tasks);
    });
  }

  isMobile() {
    return this.componentManager.environment == "mobile";
  }

  setDataChangeHandler(handler) {
    this.dataChangeHandler = handler;
  }

  parseRawTasksString(string) {
    if(!string) {string = ''}
    var allTasks = string.split(TaskDelimitter);
    var openTasks = [], completedTasks = [];
    return allTasks.filter((s) => {return s.replace(/ /g, '').length > 0}).map((rawString) => {
      return this.createTask(rawString);
    });
  }

  keyForTask(task) {
    return this.tasks.indexOf(task) + task.rawString;
  }

  reloadData() {
    this.tasks = this.parseRawTasksString(this.dataString);
  }

  getTasks() {
    if(!this.tasks) {
      this.reloadData();
    }
    return this.tasks;
  }

  createTask(rawString) {
    return new Task(rawString);
  }

  addTask(task) {
    this.tasks.unshift(task);
    this.save();
    this.reloadData();
  }

  completedTasks() {
    return this.tasks.filter((task) => {return task.completed == true})
  }

  removeTasks(tasks) {
    this.tasks = this.tasks.filter((task) => {
      return !tasks.includes(task);
    })
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

  clearCompleted() {
    this.removeTasks(this.completedTasks());
    this.save();
  }

  deleteTask(task) {
    this.removeTasks([task]);
    this.save();
  }

  save() {
    this.dataString = this.tasks.map((task) => {
      return task.rawString
    }).join(TaskDelimitter);

    if(this.note) {
      this.note.content.text = this.dataString;
      this.componentManager.saveItem(this.note);
    }
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
