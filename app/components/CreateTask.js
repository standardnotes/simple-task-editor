import React from 'react';

export default class CreateTask extends React.Component {

  constructor(props) {
    super(props);
    this.state = {rawString: ''};
  }

  onTextChange = (event) => {
    var rawString = event.target.value;
    this.setState({rawString: rawString});
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.submitTask();
    }
  }

  submitTask() {
    this.props.onSubmit(this.state.rawString);
    this.setState({rawString: ''})
  }

  render() {
    return (
      <input
        className='create-task-input body-text-color border-color' 
        autoFocus='true'
        type='text'
        dir='auto'
        value={this.state.rawString}
        onChange={this.onTextChange}
        onKeyPress={this.handleKeyPress}
      />
    )
  }

}
