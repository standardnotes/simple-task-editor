import Task from "../models/Task";
import ComponentManager from 'sn-components-api';

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
      // console.log("TaskEditor|", "Got note:", note);
      this.note = note;
      this.dataString = note.content.text;
      this.reloadData();
      this.dataChangeHandler && this.dataChangeHandler(this.tasks);
    });
  }

  setDataChangeHandler(handler) {
    this.dataChangeHandler = handler;
  }

  parseRawTasksString(string) {
    if(!string) {string = ''}
    var allTasks = string.split("\n");
    var openTasks = [], completedTasks = [];
    return allTasks.map((rawString) => {
      return this.createTask(rawString);
    });
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
  }

  completedTasks() {
    return this.tasks.filter((task) => {return task.completed == true})
  }

  removeTasks(tasks) {
    this.tasks = this.tasks.filter((task) => {
      return !tasks.includes(task);
    })
  }

  swapTaskOrder(taskA, taskB) {
    let from = this.tasks.indexOf(taskA);
    let to = this.tasks.indexOf(taskB);

    var temp = this.tasks[from];
    this.tasks[from] = this.tasks[to];
    this.tasks[to] = temp;
  }

  clearCompleted() {
    this.removeTasks(this.completedTasks());
    this.save();
  }

  save() {
    this.dataString = this.tasks.map((task) => {
      return task.rawString
    }).join("\n");

    if(this.note) {
      this.note.content.text = this.dataString;
      this.componentManager.saveItem(this.note);
    }
  }

}
