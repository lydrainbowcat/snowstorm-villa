import React from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react";

import RoleSelector from "./components/start/role_selector";
import InitialSelector from "./components/start/initial_selector";
import Log from "./components/log/log";

import logStore from "./lib/store/log_store";
import gameStore from "./lib/store/game_store";
import roleStore from "./lib/store/role_store";
import placeStore from "./lib/store/place_store";

import ROLES from "./lib/constants/role";
import PLACES from "./lib/constants/place";

import "./style/index.css";
import "react-widgets/dist/css/react-widgets.css";
import NightActor from "./components/start/night_actor";

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

    // 随机凶手
    let killerIndex = Math.floor(Math.random() * roleStore.count);
    gameStore.setKiller(roleStore.roles[killerIndex]);
    
    // 随机愚者
    let foolIndex = Math.floor(Math.random() * roleStore.count);
    if (foolIndex === killerIndex) foolIndex = (foolIndex + 1) % roleStore.count;
    roleStore.roles[foolIndex].fool = true;

    logStore.addLog(`凶手：${gameStore.killer.title}，愚者：${roleStore.roles[foolIndex].title}`)
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
        return <InitialSelector/>;
      case 2:
        return <NightActor/>;
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
