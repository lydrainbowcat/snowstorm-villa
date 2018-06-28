import React from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react";

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

@observer
class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleGameStart = this.handleGameStart.bind(this);
  }

  handleGameStart(selectedRoles) {
    logStore.addLog(`${selectedRoles.length} 人开局：${selectedRoles.map(role => role.title).join("，")}`);

    selectedRoles.forEach(role => {
      roleStore.addRole(role);
    });

    const activePlaces = PLACES.filter(place => selectedRoles.length >= place.enabled);
    activePlaces.forEach(place => {
      placeStore.addPlace(place);
    });

    const livingRoom = placeStore.getPlace("living_room");
    livingRoom.roles = roleStore.roles.slice();
    roleStore.roles.forEach(role => {
      role.location = livingRoom;
    });

    gameStore.setPeriod(1);
  }

  renderActionArea() {
    switch (gameStore.period) {
      case 0:
        return <RoleSelector
          roles={ROLES}
          onSubmit={this.handleGameStart}
        />;
      case 1:
        return <InitialPlaceSelector/>;
      default:
        return "";
    }
  }

  render() {
    return (
      <div className="container-fluid index-area">
        <div className="row">
          <div className="col-7">
            {this.renderActionArea()}
          </div>
          <div className="col-5">
            <Log/>
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
