import { observable, computed } from "mobx";

class LogStore {
  @observable logs = [];

  @computed get count() {
    return this.logs.length;
  }

  addLog(text, type) {
    this.logs.push({
      text: text,
      type: type || 0
    });
  }
}

const logStore = new LogStore();
export default logStore;
