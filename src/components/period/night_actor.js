import React from "react";
import { observer } from "mobx-react";
import PlaceTable from "../place/place_table";
import NightAction from "../action/night_action";
import KillerAction from "../action/killer_action";

import roleStore from "../../lib/store/role_store";
import gameStore from "../../lib/store/game_store";
import nightActionStore from "../../lib/store/night_action_store";
import logStore from "../../lib/store/log_store";

import CLEWS from "../../lib/constants/clew";
import PERIOD from "../../lib/constants/period";

@observer
class NightActor extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const {targetType, targetRole, targetPlace, method, clew, trickMethod, trickClew} = nightActionStore;

    // console.log 都应该改成一个几秒钟的弹窗提示
    if (targetType === "role" && targetRole === null) {
      console.log("未设定谋杀死者");
      return;
    }
    if (targetType === "place" && targetPlace === null) {
      console.log("未设定群杀地点");
      return;
    }
    if (method === null) {
      console.log("未设定杀人手法");
      return;
    }
    if (clew === null) {
      console.log("未设定遗留线索");
      return;
    }
    if (trickMethod === null) {
      console.log("未设定诡计手法");
      return;
    }
    if (trickClew === null) {
      console.log("未设定诡计线索");
      return;
    }
    if (targetType === "place" && targetPlace.name === "garden" && method.name !== "trap") {
      console.log("不能非陷阱方式群杀花园");
      return;
    }
    if (method.name === "drown" && (targetType !== "place" || targetPlace.name !== "toilet")) {
      console.log("不能溺水杀卫生间以外的地方");
      return;
    }

    // 执行杀人判定
    const killer = gameStore.killer;
    let deadRoles = [];
    let deadLocation = null;
    let logText = killer.title;

    if (targetType === "role") {
      logText += `<点杀>${targetRole.title}，`;
      deadLocation = targetRole.location;
      if (deadLocation.name !== "cellar") { // 地下室的人无法被点杀
        roleStore.removeRole(targetRole);
        deadLocation.roles.remove(targetRole);
        deadLocation.bodies.push(targetRole.title);
      }
    } else {
      logText += `<群杀>${targetPlace.title}，`;
      deadLocation = targetPlace;
      targetPlace.roles.forEach(role => {
        roleStore.removeRole(role);
        deadLocation.bodies.push(role.title);
      });
      targetPlace.roles.clear();
    }

    deadLocation.method = method;
    deadLocation.clew = clew;
    deadLocation.trickMethod = trickMethod;
    deadLocation.trickClew = trickClew;
    logText += `线索为<${method.title}><${clew.title}>，诡计为<${trickMethod.title}><${trickClew.title}>。`;

    const killerLocation = killer.location;

    if (killerLocation.name === "kitchen") { // 凶手在厨房过夜，案发地会留下零食
      deadLocation.extraClews.push(CLEWS.filter(clew => clew.name === "snack")[0].title);
    }
    if (killerLocation.name === "garden") { // 凶手在花园过夜，案发地会留下泥土
      deadLocation.extraClews.push(CLEWS.filter(clew => clew.name === "soil")[0].title);
    }

    if (deadLocation.extraClews.length > 0) {
      logText += `${deadLocation.title}留下额外线索<${deadLocation.extraClews.join(" ")}>。`;
    }

    logStore.addLog(logText);
    gameStore.setPeriod(PERIOD.NIGHT_FEEDBACK);
  }

  render() {
    const roles = roleStore.roles;
    return (
      <div className="container">
        <PlaceTable/>
        <h5 className="text-center spacing-20">夜晚行动</h5>
        {roles.map(role=>
          <NightAction
            key={role.name}
            role={role}
          />
        )}
        <KillerAction/>
        <div className="row">
          <div className="col text-right">
            <button type="button" className="btn btn-outline-success spacing-20"
                    onClick={this.handleSubmit}>
              尝试结算
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default NightActor;
