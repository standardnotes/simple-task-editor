import React from 'react';
import GroupList from './components/GroupList';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="sn-component">
        <div className="sk-panel static">
          <GroupList />
        </div>
      </div>
    );
  }
}
