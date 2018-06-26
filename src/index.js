import React from "react";
import ReactDOM from "react-dom";
import RoleSelector from "./components/start/role_selector";
import roles from "./lib/role.js";
import "./style/index.css";

class App extends React.Component {
  render() {
    return (
      <div className="flex-row">
        <div className="flex-item">
          <RoleSelector
            roles={roles}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
