import { observable, computed } from "mobx";

class LogStore {
  protos = {
    value: [],
    array: ["logs"],
    map: []
  };

  @observable logs = [];
  @observable alerts = [];

  @computed get count() {
    return this.logs.length;
  }

  @computed get allText() {
    return this.logs.map(log => log.text).join("\n");
  }

  addLog(text, type) {
    this.logs.push({
      text: text,
      type: type || 0
    });
  }

  copyText(index) {
    if (index < 0 || index >= this.count) return "";
    const log = this.logs[index];
    if (log.type !== 2) return log.text;
    const st = log.text.indexOf("\"");
    const ed = log.text.indexOf("\"", st + 1);
    if (st === -1 || ed === -1) return log.text;
    return log.text.substr(st + 1, ed - st - 1);
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
