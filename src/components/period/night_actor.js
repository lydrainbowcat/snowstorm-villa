import React from "react";
import { observer } from "mobx-react";
import PlaceTable from "../place/place_table";
import NightAction from "../action/night_action";
import KillerAction from "../action/killer_action";

import roleStore from "../../lib/store/role_store";
import gameStore from "../../lib/store/game_store";
import nightActionStore from "../../lib/store/night_action_store";
import logStore from "../../lib/store/log_store";
import CommonProcessor from "../../lib/processor/common";

import GLOBAL from "../../lib/constants/global";
import PERIOD from "../../lib/constants/period";
import KillerProcessor from "../../lib/processor/killer";

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

    // 验证作案能否成功
    const reason = KillerProcessor.validateKilling();
    if (reason !== null) {
      logStore.addAlert("刀法结算失败", reason);
      return;
    }

    // 结算作案
    const killerLog = KillerProcessor.actKilling();
    logStore.addLog(killerLog, 1);

    // 执行夜晚胜负判定
    if (CommonProcessor.judgeGameForKilling()) {
      gameStore.setPeriod(PERIOD.GAME_OVER);
    } else {
      gameStore.setPeriod(PERIOD.NIGHT_FEEDBACK);
    }
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
