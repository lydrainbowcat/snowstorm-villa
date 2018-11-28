import React from "react";
import { observer } from "mobx-react";
import Clipboard from "react-clipboard.js";
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
              <a href="#" className={`nav-link ${navType === 1 ? "active" : ""}`}
                 onClick={this.handleChangeType.bind(this, 1)}>
                剧本揭秘
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className={`nav-link ${navType === 2 ? "active" : ""}`}
                 onClick={this.handleChangeType.bind(this, 2)}>
                公告/反馈
              </a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {logs.filter(log => this.state.navType === 0 || log.type === this.state.navType).map((log, i) =>
            <p key={i} className="card-text">
              {log.text}
              {log.type === 2 &&
               <Clipboard component="a" button-href="#" data-clipboard-text={logStore.copyText(i)}>[复制]</Clipboard>}
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
