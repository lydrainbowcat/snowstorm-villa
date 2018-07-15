import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import logStore from "../../lib/store/log_store";

@observer
class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    logStore.renewAlerts();
  }

  render() {
    const {alerts} = this.props;

    return (
      <div className="alert alert-warning alert-dismissible fade show" role="alert">
        {alerts.map((alert, i) =>
          <div key={i}><b>{alert.title || ""}</b> {alert.content}</div>
        )}
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true" onClick={this.handleClose}>&times;</span>
        </button>
      </div>
    );
  }
}

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

export default Alert;
