import React, { Component, PropTypes } from 'react';

class TaskRow extends Component {
  constructor(props) {
    super(props);
    this.state = {isChecked: props.task.completed, text: props.task.content};
  }

  componentDidMount() {
    this.resizeTextArea(this.textArea);
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

    this.setState({text: text})
  }

  onKeyUp = ($event) => {
    var element = $event.target;
    this.resizeTextArea(element);
  }

  resizeTextArea(textarea) {
    textarea.style.height = "5px";
    textarea.style.height = (textarea.scrollHeight)+"px";
  }

  render() {
    const { isChecked } = this.state;

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
          value={this.state.text}
          onChange={this.onTextChange}
          onKeyUp={this.onKeyUp} type="text"
          className='task-input-label'
        />

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
