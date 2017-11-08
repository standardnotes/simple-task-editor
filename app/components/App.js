import React from 'react';
import Tasks from './Tasks';
import TasksManager from '../lib/tasksManager';

require('./App.css');

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Tasks />
      </div>
    );
  }
}
