import React from "react";
import ReactDOM from "react-dom";
import RoleSelector from "./components/start/role_selector";
import InitialPlaceSelector from "./components/start/initial_place_selector";
import Log from "./components/log/log";

import logStore from "./lib/store/log_store";
import gameStore from "./lib/store/game_store";
import roleStore from "./lib/store/role_store";
import placeStore from "./lib/store/place_store";

import ROLES from "./lib/constants/role";
import PLACES from "./lib/constants/place";

import "./style/index.css";
import "react-widgets/dist/css/react-widgets.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleGameStart = this.handleGameStart.bind(this);
    this.state = {
      period: 0
    };
  }

  handleGameStart(selectedRoles) {
    gameStore.addLog(`${selectedRoles.length} 人开局：${selectedRoles.map(role => role.title).join("，")}`);

    selectedRoles.forEach(role => {
      roleStore.addRole(role);
    });

    const activePlaces = PLACES.filter(place => selectedRoles.length >= place.enabled);
    activePlaces.forEach(place => {
      placeStore.addPlace(place);
    });

    const livingRoom = placeStore.getRoles("living_room");
    placeStore.setRoles("living_room", roleStore.roles);
    roleStore.roles.forEach(role => {
      role.location = livingRoom;
    });
  }

  renderActionArea(period) {
    switch (period) {
      case 0:
        return <RoleSelector
          roles={ROLES}
          onSubmit={this.handleGameStart}
        />;
      case 1:
        return <InitialPlaceSelector
          roleStore={roleStore}
          placeStore={placeStore}
        />;
      default:
        return "";
    }
  }

  render() {
    const {period, logs} = this.state;

    return (
      <div className="container-fluid index-area">
        <div className="row">
          <div className="col-7">
            {this.renderActionArea(period)}
          </div>
          <div className="col-5">
            <Log
              logStore={logStore}
            />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById("root")
);
