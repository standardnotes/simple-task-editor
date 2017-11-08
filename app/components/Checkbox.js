import React, { Component, PropTypes } from 'react';

class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {isChecked: props.task.completed};
  }

  toggleCheckboxChange = () => {
    const { handleCheckboxChange } = this.props;

    this.setState(({ isChecked }) => ({
      isChecked: !isChecked
    }));

    handleCheckboxChange(this.props.task);
  }

  render() {
    const { isChecked } = this.state;

    let task = this.props.task;
    let classes = `task ${task.completed ? 'completed' : ''}`
    return (
      <div className={classes}>
        <label className='task-label'>
          <input
            type="checkbox"
            value={task.content}
            checked={isChecked}
            onChange={this.toggleCheckboxChange}
          />

          {task.content}
          {`(${task.rawString})`}
        </label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  task: PropTypes.object.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
};

export default Checkbox;
