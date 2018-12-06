import React from 'react';

export default class CreateTask extends React.Component {

  constructor(props) {
    super(props);
    this.state = {rawString: (this.props.unsavedTask || '')};
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.unsavedTask !== this.state.rawString;
  }

  componentDidUpdate(props) {
    this.setState({ rawString: props.unsavedTask })
  }

  onTextChange = (event) => {
    // save this as the current 'unsaved' task if while we're not officially saving it as an actual task yet
    var rawString = event.target.value;
    this.props.onUpdate(rawString);
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      var rawString = event.target.value;
      this.submitTask(rawString);
    }
  }

  submitTask(value) {
    this.props.onSubmit(value);
  }

  render() {
    return (
      <input
        className='create-task-input'
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
