import React from "react";
import { observer } from "mobx-react";
import PlaceTable from "../place/place_table";
import NightAction from "../action/night_action";
import roleStore from "../../lib/store/role_store";
import gameStore from "../../lib/store/game_store";
import KillerAction from "../action/killer_action";
import nightActionsStore from "../../lib/store/night_actions_store";

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

    const targetType = nightActionsStore.targetType;
    const targetRole = nightActionsStore.targetRole;
    const targetPlace = nightActionsStore.targetPlace;
    const method = nightActionsStore.method;
    const clew = nightActionsStore.clew;
    const trickMethod = nightActionsStore.trickMethod;
    const trickClew = nightActionsStore.trickClew;

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
    gameStore.setPeriod(3);
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
