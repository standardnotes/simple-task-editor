import React from 'react';
import ExtensionBridge from '../lib/ExtensionBridge';
import TaskRow from './TaskRow';
import Task from '../models/Task';
import CreateTask from './CreateTask';
import Sortable from 'sortablejs';

export default class GroupComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      unsavedTask: '',
      openTasks: props.group.openTasks(),
      completedTasks: props.group.completedTasks(),
    };
  }

  initiateSorting() {
    if(ExtensionBridge.get().isMobile() || this.didInitiateSorting) {
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

  deleteTask = (task) => {
    this.props.group.removeTasks([task]);
    this.props.onChange();
  }

  toggleTaskStatus = (task) => {
    task.toggleStatus();
    if(!task.completed) {
      this.props.group.moveTaskToTop(task);
    }

    setTimeout(() => {
      // Allow UI to show checkmark before transferring to other list
      this.props.onChange();
    }, 300);
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

    this.props.group.changeTaskPosition(fromTask, toTask);
    if(isDestinationCompleted) {
      fromTask.markCompleted();
    } else {
      fromTask.markOpen();
    }

    this.props.onChange();
  }

  createTask = (rawString) => {
    this.props.group.setUnsavedTask('');
    let task = new Task(rawString);
    this.props.group.addTask(task);
    this.props.onChange();
  }

  saveUnsavedTask = (rawString) => {
    // save current entry to task list that has not been officially saved by pressing 'enter' yet
    this.props.group.setUnsavedTask(rawString);
    this.props.onChange();
  }

  onClearCompleted = () => {
    if(confirm("Are you sure you want to clear completed tasks for this group?")) {
      this.props.group.clearCompleted();
      this.props.onChange();
    }
  }

  taskRowForTask(task, index) {
    return (
      <TaskRow
        task={task}
        handleCheckboxChange={this.toggleTaskStatus}
        handleTextChange={this.props.onChange}
        deleteTask={this.deleteTask}
        key={this.props.group.keyForTask(task)}
      />
    )
  }

  render() {
    let {unsavedTask, openTasks, completedTasks} = this.state;

    return (
      <div>

        <h3>{this.props.group.name}</h3>

        <div>
          <CreateTask onSubmit={this.createTask} onUpdate={this.saveUnsavedTask} unsavedTask={unsavedTask} />
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
