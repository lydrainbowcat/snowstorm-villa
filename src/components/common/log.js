import React from "react";
import { observer } from "mobx-react";
import Clipboard from "react-clipboard.js";
import archive from "../../lib/store/archive";
import logStore from "../../lib/store/log_store";

@observer
class Log extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navType: 0
    };
  }

  handleChangeType(navType, e) {
    e.preventDefault();
    this.setState({
      navType: navType
    });
  }

  handleLoadArchive(index, e) {
    e.preventDefault();
    archive.load(index);
  }

  renderArchive(index) {
    let period = null;
    switch ((index - 1) % 4) {
      case 0: period = "夜晚 入夜"; break;
      case 1: period = "夜晚 作案反馈"; break;
      case 2: period = "白天 天亮"; break;
      case 3: period = "白天 自由移动"; break;
      default: period = ""; break;
    }
    /* eslint-disable jsx-a11y/href-no-hash */
    return <span>
      {index === 0 ? "开局 选择初始地点 " : `第 ${Math.floor((index + 1) / 4)} 天 ${period} `}
      <a href="#" onClick={this.handleLoadArchive.bind(this, index)}>[读取]</a>
    </span>;
    /* eslint-enable jsx-a11y/href-no-hash */
  }

  render() {
    const logs = logStore.logs;
    const { navType } = this.state;

    return (
      /* eslint-disable jsx-a11y/href-no-hash */
      <div className="card spacing-20">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <a href="#" className={`nav-link ${navType === 0 ? "active" : ""}`}
                 onClick={this.handleChangeType.bind(this, 0)}>
                全部事件
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className={`nav-link ${navType === 2 ? "active" : ""}`}
                 onClick={this.handleChangeType.bind(this, 2)}>
                公告/反馈
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className={`nav-link ${navType === -1 ? "active" : ""}`}
                 onClick={this.handleChangeType.bind(this, -1)}>
                阶段存档
              </a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {logs.filter(log => (this.state.navType === 0 && log.type >= 0) || log.type === this.state.navType).map((log, i) =>
            <p key={i} className="card-text">
              {log.type >= 0 && log.text}
              {log.type === 2 &&
                <Clipboard component="a" button-href="#" data-clipboard-text={logStore.copyText(log)}>[复制]</Clipboard>}
              {log.type === -1 && this.renderArchive(parseInt(log.text, 10))}
            </p>
          )}
        </div>
        <div className="card-footer text-right">
          <Clipboard component="a" button-href="#" data-clipboard-text={logStore.allText}>复制全部</Clipboard>
        </div>
      </div>
      /* eslint-enable jsx-a11y/href-no-hash */
    );
  }
}

export default Log;
