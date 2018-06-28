import React from "react";
import PropTypes from "prop-types";

class Log extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {logs} = this.props;

    return (
      <div className="card spacing-20">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <a className="nav-link active" href="#">全部事件</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">凶手行动</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">公告内容</a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {logs.map((log, i) =>
            <p key={i} className="card-text">
              {log.text}
            </p>
          )}
        </div>
        <div className="card-footer text-right">
          <a className="spacing-inline-10" href="#">复制上一条</a>
          <a href="#">复制全部</a>
        </div>
      </div>
    );
  }
}

Log.propTypes = {
  logs: PropTypes.array.isRequired
};

export default Log;
