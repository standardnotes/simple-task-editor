import React from 'react';
import ExtensionBridge from '../lib/ExtensionBridge';
import GroupComponent from './GroupComponent';

export default class GroupList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      groups: ExtensionBridge.get().getGroups()
    };

    ExtensionBridge.get().setDataChangeHandler(() => {
      this.reloadGroups();
    })

    ExtensionBridge.get().setOnReady(() => {
      let platform = ExtensionBridge.get().getPlatform();
      // add platform class to main <html> element
      var root = document.documentElement;
      root.className += platform;
      // this.setState({ready: true})
    })
  }

  reloadGroups() {
    this.setState({groups: ExtensionBridge.get().getGroups()});
  }

  componentDidMount() {
    ExtensionBridge.get().initiateBridge();
    this.reloadGroups();
  }

  onGroupDataChange = (group) => {
    ExtensionBridge.get().save();
    this.reloadGroups();
  }

  onAddGroup = () => {
    ExtensionBridge.get().addGroup("New group");
  }

  render() {
    return (
      <div>
        {this.state.groups.map((group) =>
          <GroupComponent
            onChange={() => this.onGroupDataChange(group)}
            key={group.getKey()}
            group={group}
          />
        )}
        <div id="add-group-button" className="sk-button info" onClick={this.onAddGroup}>
          <div className="sk-label">New Group</div>
        </div>
      </div>
    )
  }

}
