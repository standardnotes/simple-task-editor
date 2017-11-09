export default class Task {

  static OpenPrefix = "- [] ";
  static CompletedPrefix = "- [x] ";

  constructor(rawString) {
    this.rawString = rawString;
    this.completed = rawString.startsWith(Task.CompletedPrefix);

    if(!this.completed && !rawString.startsWith(Task.OpenPrefix)) {
      // This is a text being created from user input, prepend open prefix
      this.rawString = Task.OpenPrefix + this.rawString;
    }
  }

  get content() {
    return this.rawString.replace(Task.OpenPrefix, "").replace(Task.CompletedPrefix, "");
  }

  toggleStatus() {
    this.completed = !this.completed;
    this.updateRawString();
  }

  markCompleted() {
    this.completed = true;
    this.updateRawString();
  }

  markOpen() {
    this.completed = false;
    this.updateRawString();
  }

  setContentString(string) {
    this.rawString = string;
    if(this.completed) {
      this.rawString = Task.CompletedPrefix + this.rawString;
    } else {
      this.rawString = Task.OpenPrefix + this.rawString;
    }
  }

  updateRawString() {
    if(this.completed) {
      this.rawString = this.rawString.replace(Task.OpenPrefix, Task.CompletedPrefix);
    } else {
      this.rawString = this.rawString.replace(Task.CompletedPrefix, Task.OpenPrefix);
    }
  }
}
