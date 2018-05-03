import React from 'react';
import TasksManager from '../lib/tasksManager';
import TaskRow from './TaskRow';
import Task from '../models/Task';
import CreateTask from './CreateTask';
import Sortable from 'sortablejs';

export default class Tasks extends React.Component {

  constructor(props) {
    super(props);
    this.state = {openTasks: [], completedTasks: []};
    TasksManager.get().setDataChangeHandler((tasks) => {
      // We need TasksManager.get().isMobile() to be defined, and this handler is called once on bridge ready.
      this.initiateSorting();
      this.updateTasks();
    })
  }

  componentDidMount() {
    this.updateTasks();
  }

  initiateSorting() {
    if(TasksManager.get().isMobile() || this.didInitiateSorting) {
      return;
    }
    this.didInitiateSorting = true;

    let properties = {
      draggable: '.task',
      dragClass: 'task-dragging',
      onEnd: this.taskCompletedDragging
    };

    properties['name'] = 'open-tasks';
    Sortable.create(document.getElementById('open-tasks'), properties);

    properties['name'] = 'completed-tasks';
    Sortable.create(document.getElementById('completed-tasks'), properties);
  }

  updateTasks() {
    var tasks = TasksManager.get().getTasks();
    var openTasks = [], completedTasks = [];
    tasks.forEach((task, index) => {
      if(task.completed) {
        completedTasks.push(task);
      } else {
        openTasks.push(task);
      }
    })

    this.setState({openTasks: openTasks, completedTasks: completedTasks});
  }

  deleteTask = (task) => {
    TasksManager.get().deleteTask(task);
    this.updateTasks();
  }

  toggleTaskStatus = (task) => {
    task.toggleStatus();
    TasksManager.get().moveTaskToTop(task);

    setTimeout(() => {
      // Allow UI to show checkmark before transferring to other list
      this.taskStatusUpdated();
    }, 300);
  }

  handleTaskTextChange = (task) => {
    TasksManager.get().save();
  }

  taskStatusUpdated() {
    this.updateTasks();
    TasksManager.get().save();
  }

  taskAtIndex(list, relativeIndex) {
    if(list == 0) {
      return this.state.openTasks[relativeIndex];
    } else {
      return this.state.completedTasks[relativeIndex];
    }
  }

  taskCompletedDragging = (evt) => {
    let isSourceOpen =  evt.from.id == 'open-tasks';
    let isSourceCompleted =  evt.from.id == 'completed-tasks';
    let isDestinationCompleted = evt.to.id == 'completed-tasks';
    let isDestinationOpen = !isDestinationCompleted;
    let fromIndex = evt.oldIndex;
    let toIndex = evt.newIndex;

    var fromTask = this.taskAtIndex(isSourceOpen ? 0 : 1, fromIndex);
    var toTask = this.taskAtIndex(isDestinationOpen ? 0 : 1, toIndex);

    TasksManager.get().changeTaskPosition(fromTask, toTask);
    if(isDestinationCompleted) {
      fromTask.markCompleted();
    } else {
      fromTask.markOpen();
    }

    this.taskStatusUpdated();
  }

  createTask = (rawString) => {
    let task = TasksManager.get().createTask(rawString);
    TasksManager.get().addTask(task);
    this.updateTasks();
  }

  onClearCompleted = () => {
    if(confirm("Are you sure you want to clear completed tasks?")) {
      TasksManager.get().clearCompleted();
      this.updateTasks();
    }
  }

  taskRowForTask(task, index) {
    return (
      <TaskRow
        task={task}
        handleCheckboxChange={this.toggleTaskStatus}
        handleTextChange={this.handleTaskTextChange}
        deleteTask={this.deleteTask}
        key={TasksManager.get().keyForTask(task)}
      />
    )
  }

  render() {
    let {openTasks, completedTasks} = this.state;

    return (
      <div className="element-text-color">

        <div>
          <CreateTask onSubmit={this.createTask} />
        </div>

        <div className='task-section'>
          <h3>Open Tasks</h3>
          <div id="open-tasks">
            {openTasks.map((task, index) => {
              return this.taskRowForTask(task, index);
            })}
          </div>
        </div>

        <div className='task-section'>
          <h3>Completed Tasks</h3>
          <div id="completed-tasks">
            {completedTasks.map((task, index) => {
              return this.taskRowForTask(task, index);
            })}
          </div>

          {completedTasks.length > 0 &&
            <a className="clear-button" onClick={this.onClearCompleted}>Clear Completed</a>
          }
        </div>

      </div>
    )
  }

}
