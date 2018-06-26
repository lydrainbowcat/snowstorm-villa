import React from "react";
import ReactDOM from "react-dom";
import RoleSelector from "./components/start/role_selector";
import Log from "./components/log/log";
import roles from "./lib/role.js";
import "./style/index.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleGameStart = this.handleGameStart.bind(this);
    this.state = {
      logs: []
    };
  }

  handleGameStart(selectedRoles) {
    const newLogs = this.state.logs.slice();
    newLogs.push({
      text: `${selectedRoles.length} 人开局：${selectedRoles.map(role => role.title).join("，")}`
    });
    this.setState({
      logs: newLogs
    });
  }

  render() {
    const { logs } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-7">
            <RoleSelector
              roles={roles}
              onSubmit={this.handleGameStart}
            />
          </div>
          <div className="col-5">
            <Log
              logs={logs}
            />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
