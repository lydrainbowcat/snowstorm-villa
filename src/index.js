import React from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react";

import PlaceTable from "./components/place/place_table";
import RoleSelector from "./components/start/role_selector";
import InitialSelector from "./components/start/initial_selector";
import NightActor from "./components/period/night_actor";
import NightFeedback from "./components/period/night_feedback";
import ConfirmDeath from "./components/period/confirm_death";
import DayActor from "./components/period/day_actor";
import Voter from "./components/period/voter";
import Log from "./components/common/log";
import Alert from "./components/common/alert";

import logStore from "./lib/store/log_store";
import gameStore from "./lib/store/game_store";
import roleStore from "./lib/store/role_store";
import placeStore from "./lib/store/place_store";

import ROLES from "./lib/constants/role";
import PLACES from "./lib/constants/place";
import PERIOD from "./lib/constants/period";
import ENUM from "./lib/constants/enum";

import "./style/index.css";
import "react-widgets/dist/css/react-widgets.css";
import Utils from "./lib/utils";

@observer
class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleGameStart = this.handleGameStart.bind(this);
  }

  handleGameStart(selectedRoles) {
    logStore.addLog(`${selectedRoles.length} 人开局：${selectedRoles.map(role => role.title).join("，")}`);
    gameStore.finalDay = selectedRoles.length === 6 ? 3 : 4;

    selectedRoles.forEach(role => {
      roleStore.addRole(role);
    });

    const activePlaces = PLACES.filter(place => selectedRoles.length >= place.enabled);
    activePlaces.forEach(place => {
      placeStore.addPlace(place);
    });

    const livingRoom = placeStore.getPlace(ENUM.PLACE.LIVING_ROOM);
    livingRoom.roles = roleStore.roles.slice();
    Utils.shuffleArray(livingRoom.roles);

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

    logStore.addLog(`凶手：${gameStore.killer.title}，愚者：${roleStore.roles[foolIndex].title}`);
    gameStore.setPeriod(PERIOD.INITIAL_SELECT);
  }

  renderActionArea() {
    switch (gameStore.period) {
      case PERIOD.ROLE_SELECT:
        return <RoleSelector
          roles={ROLES}
          onSubmit={this.handleGameStart}
        />;
      case PERIOD.INITIAL_SELECT:
        return <InitialSelector/>;
      case PERIOD.NIGHT_ACT:
        return <NightActor/>;
      case PERIOD.NIGHT_FEEDBACK:
        return <NightFeedback/>;
      case PERIOD.CONFIRM_DEATH:
        return <ConfirmDeath/>;
      case PERIOD.DAY_ACT:
        return <DayActor/>;
      case PERIOD.VOTE:
        return <Voter/>;
      default:
        return <PlaceTable/>;
    }
  }

  renderAlertArea() {
    return logStore.alerts.length > 0 ? <Alert alerts={logStore.alerts}/> : "";
  }

  render() {
    return (
      <div className="container-fluid index-area">
        <div className="row">
          <div className="col-7">
            {this.renderActionArea()}
            {this.renderAlertArea()}
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
