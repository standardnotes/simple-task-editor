import React, { Component, PropTypes } from 'react';

class TaskRow extends Component {
  constructor(props) {
    super(props);
    this.state = {isChecked: props.task.completed, task: props.task};
  }

  componentDidMount() {
    this.resizeTextArea(this.textArea);
  }

  componentWillReceiveProps(newProps) {
    this.setState({task: newProps.task, isChecked: newProps.task.completed});

    // Wait till after render
    setTimeout(() => {
      this.resizeTextArea(this.textArea);
    }, 1);
  }

  toggleCheckboxChange = () => {
    const { handleCheckboxChange } = this.props;

    this.setState(({ isChecked }) => ({
      isChecked: !isChecked
    }));

    handleCheckboxChange(this.props.task);
  }

  onTextChange = ($event) => {
    var text = event.target.value;
    this.props.task.setContentString(text);
    this.props.handleTextChange(this.props.task, text);

    this.forceUpdate();
  }

  onKeyUp = ($event) => {
    var element = $event.target;
    this.resizeTextArea(element);
  }

  resizeTextArea(textarea) {
    // set to 1 first to reset scroll height in case it shrunk
    textarea.style.height = "1px";
    textarea.style.height = (textarea.scrollHeight)+"px";
  }

  render() {
    let { isChecked } = this.state;

    let task = this.props.task;

    let classes = `task ${task.completed ? 'completed' : ''}`
    return (
      <div className={classes}>

        <input
          type="checkbox"
          value={task.content}
          checked={isChecked}
          onChange={this.toggleCheckboxChange}
          className="checkbox"
        />

        <textarea
          ref={(textarea) => {this.textArea = textarea}}
          value={task.content}
          onChange={this.onTextChange}
          onKeyUp={this.onKeyUp} type="text"
          className='task-input-label'
        />

        <label>{task.content}</label>

        <div className="hover-container">
          <button>Rename</button>
          <button>Delete</button>
        </div>
      </div>
    );
  }
}

TaskRow.propTypes = {
  task: PropTypes.object.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
};

export default TaskRow;
