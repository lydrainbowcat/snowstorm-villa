import React from "react";
import { observer } from "mobx-react";
import PlaceTable from "../place/place_table";
import NightAction from "../action/night_action";
import KillerAction from "../action/killer_action";

import roleStore from "../../lib/store/role_store";
import gameStore from "../../lib/store/game_store";
import nightActionStore from "../../lib/store/night_action_store";
import logStore from "../../lib/store/log_store";

import GLOBAL from "../../lib/constants/global";
import CLEWS from "../../lib/constants/clew";
import PERIOD from "../../lib/constants/period";
import Utils from "../../lib/utils";

@observer
class NightActor extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRandomKill  = this.handleRandomKill.bind(this);
  }

  handleRandomKill() {
    nightActionStore.randomKill();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {targetType, targetRole, targetPlace, method, clew, trickMethod, trickClew} = nightActionStore;
    const killer = gameStore.killer;
    const killerLocation = killer.location;

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
    if (method.name !== "drown" && killer.methods.indexOf(method.name) === -1) {
      if (!((method.name === "blade" || method.name === "strangle") && killerLocation.name === "kitchen")) {
        console.log("人物模版没有选定的杀人手法");
        return;
      }
    }

    gameStore.lastMethodName = method.name;
    gameStore.usedClewsName.push(clew.name);

    // 执行杀人判定
    let deadLocation = null;
    let logText = killer.title;
    let deadNameList = [];

    if (targetType === "role") {
      logText += `<点杀>${targetRole.title}，`;
      deadLocation = targetRole.location;
      if (deadLocation.name !== "cellar") { // 地下室的人无法被点杀
        roleStore.killRole(targetRole);
        deadLocation.roles.remove(targetRole);
        deadLocation.bodies.push(targetRole.title);
        deadNameList.push(targetRole.title);
      }
    } else {
      logText += `<群杀>${targetPlace.title}，`;
      deadLocation = targetPlace;
      targetPlace.roles.forEach(role => {
        roleStore.killRole(role);
        deadLocation.bodies.push(role.title);
        deadNameList.push(role.title);
      });
      targetPlace.roles.clear();
      Utils.shuffleArray(deadLocation.bodies);
    }

    logText += `线索为<${method.title}><${clew.title}>，诡计为<${trickMethod.title}><${trickClew.title}>，`;
    if (deadNameList.length > 0) {
      logText += "死者有：" + deadNameList.join("，") + "。";
      deadLocation.method = method;
      deadLocation.clew = clew;
      deadLocation.trickMethod = trickMethod;
      deadLocation.trickClew = trickClew;
    } else {
      logText += `行凶失败。`;
      deadLocation.extraClews.push(clew.title); // TODO: 不留下多条同名额外线索
    }

    if (killerLocation.name === "kitchen") { // 凶手在厨房过夜，案发地会留下零食
      deadLocation.extraClews.push(CLEWS.filter(clew => clew.name === "snack")[0].title);
    }
    if (killerLocation.name === "garden") { // 凶手在花园过夜，案发地会留下泥土
      deadLocation.extraClews.push(CLEWS.filter(clew => clew.name === "soil")[0].title);
    }

    if (deadLocation.extraClews.length > 0) {
      Utils.shuffleArray(deadLocation.extraClews);
      logText += `${deadLocation.title}留下额外线索<${deadLocation.extraClews.join(" ")}>。`;
    }

    logStore.addLog(logText, 1);

    // 执行夜晚游戏胜负判定
    if (roleStore.roles.filter(role => role === killer).length === 0) {
      if (roleStore.count === 0) {
        logStore.addLog("游戏结束：所有人死亡，导演胜利。", 1);
      } else {
        logStore.addLog("游戏结束：凶手死亡，受困者胜利。", 1);
      }
      gameStore.setPeriod(PERIOD.GAME_OVER);
      return;
    }
    if (roleStore.count <= 2) {
      logStore.addLog("游戏结束：受困者存活数过少，凶手胜利。", 1);
      gameStore.setPeriod(PERIOD.GAME_OVER);
      return;
    }

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
            {GLOBAL.DEBUGGING &&
            <button type="button" className="btn btn-outline-info spacing-20 spacing-inline-10"
                    onClick={this.handleRandomKill}>
              随机刀法
            </button>}
            <button type="button" className="btn btn-outline-success spacing-20 spacing-inline-10"
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
