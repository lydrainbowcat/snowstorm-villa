import { observable, computed } from "mobx";

class LogStore {
  @observable logs = [];
  @observable alerts = [];

  @computed get count() {
    return this.logs.length;
  }

  addLog(text, type) {
    this.logs.push({
      text: text,
      type: type || 0
    });
  }

  addAlert(title, content) {
    this.alerts.push({
      title: title,
      content: content
    });
  }

  renewAlerts() {
    this.alerts = [];
  }
}

const logStore = new LogStore();
export default logStore;
