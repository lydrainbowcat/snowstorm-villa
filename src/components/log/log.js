import React from "react";
import PropTypes from "prop-types";

class Log extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { logs } = this.props;

    return (
      <div className="card spacing-20">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
              <a class="nav-link active" href="#">全部事件</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">凶手行动</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">公告行动</a>
            </li>
          </ul>
        </div>
        <div class="card-body">
          {logs.map(log =>
            <p class="card-text">
              {log.text}
            </p>
          )}
        </div>
        <div class="card-footer text-right">
          <a href="#">复制</a>
        </div>
      </div>
    );
  }
}

Log.propTypes = {
  logs: PropTypes.array.isRequired
};

export default Log;
