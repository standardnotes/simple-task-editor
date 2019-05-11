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
    };
  }

  componentDidUpdate() {
    this.addSortingToElements();
  }

  addSortingToElements() {
    if(ExtensionBridge.get().isMobile()) {
      return;
    }

    let properties = {
      draggable: '.task',
      dragClass: 'task-dragging',
      onEnd: this.taskCompletedDragging
    };

    if(!this.didConfigureOpenTasks && this.openTasksElement) {
      properties['name'] = 'open-tasks';
      Sortable.create(this.openTasksElement, properties);
      this.didConfigureOpenTasks = true;
    }

    if(!this.didConfigureCompletedTasks && this.completedTasksElement) {
      properties['name'] = 'completed-tasks';
      Sortable.create(this.completedTasksElement, properties);
      this.didConfigureCompletedTasks = true;
    }
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
      return this.props.group.getOpenTasks()[relativeIndex];
    } else {
      return this.props.group.getCompletedTasks()[relativeIndex];
    }
  }

  taskCompletedDragging = (evt) => {
    let isSourceOpen =  evt.from.className.includes('open-tasks');
    let isSourceCompleted =  evt.from.className.includes('completed-tasks');
    let isDestinationCompleted = evt.to.className.includes('completed-tasks');
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
    let task = new Task(rawString);
    this.props.group.addTask(task);
    this.props.group.setUnsavedTask('');
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
    let openTasks = this.props.group.getOpenTasks();
    let completedTasks = this.props.group.getCompletedTasks();

    return (
      <div>

        <div className="sk-h3 sk-bold">{this.props.group.name}</div>
        <div className="sk-panel-row"/>

        <div>
          <CreateTask
            onSubmit={this.createTask}
            onUpdate={this.saveUnsavedTask}
            unsavedTask={this.props.group.unsavedTask}
          />
        </div>

        {openTasks.length > 0 &&
          <div className='task-section'>
            <h3>Open Tasks</h3>
            <div ref={(ref) => this.openTasksElement = ref} className="open-tasks">
              {openTasks.map((task, index) => {
                return this.taskRowForTask(task, index);
              })}
            </div>
          </div>
        }

        {completedTasks.length > 0 &&
          <div className='task-section'>
            <h3>Completed Tasks</h3>
            <div ref={(ref) => this.completedTasksElement = ref} className="completed-tasks">
              {completedTasks.map((task, index) => {
                return this.taskRowForTask(task, index);
              })}
            </div>
            {completedTasks.length > 0 &&
              <a className="clear-button" onClick={this.onClearCompleted}>Clear Completed</a>
            }
          </div>
        }

      </div>
    )
  }
}
