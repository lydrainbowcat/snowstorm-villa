import React from "react";
import { observer } from "mobx-react";
import PlaceTable from "../place/place_table";
import NightAction from "../action/night_action";
import KillerAction from "../action/killer_action";

import GLOBAL from "../../lib/constants/global";
import PERIOD from "../../lib/constants/period";

import archive from "../../lib/store/archive";
import roleStore from "../../lib/store/role_store";
import gameStore from "../../lib/store/game_store";
import nightActionStore from "../../lib/store/night_action_store";
import logStore from "../../lib/store/log_store";

import CommonProcessor from "../../lib/processor/common";
import KillerProcessor from "../../lib/processor/killer";
import SkillProcessor from "../../lib/processor/skill";

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

    // 结算夜晚技能（作案前）
    if (nightActionStore.acting === 0) {
      SkillProcessor.actSkillsBeforeKilling();
    }

    // 验证作案能否成功
    const reason = KillerProcessor.validateKilling();
    if (reason !== null) {
      logStore.addAlert("刀法结算失败", reason);
      return;
    }

    // 作案前<疾行>
    const scudPlace = nightActionStore.scudBeforeKilling.place;
    if (!gameStore.scudUsed && scudPlace !== null) {
      gameStore.setScudUsed(scudPlace);
      CommonProcessor.actNightMove(gameStore.killer, scudPlace, true);
    }

    // 结算作案
    const killerLog = KillerProcessor.actKilling();
    logStore.addLog(killerLog, 1);

    // 结算夜晚技能（作案后）
    SkillProcessor.actSkillsAfterKilling();

    // 执行夜晚胜负判定
    if (CommonProcessor.judgeGameForKilling()) {
      gameStore.setPeriod(PERIOD.GAME_OVER);
    } else {
      gameStore.setPeriod(PERIOD.NIGHT_FEEDBACK);
      archive.save();
    }
  }

  render() {
    const roles = roleStore.roles;
    return (
      <div className="container">
        <PlaceTable/>
        <h5 className="text-center spacing-20">夜晚行动</h5>
        <div className="alert alert-info fade show alert-thin-gutters spacing-20">
          <small>
            夜晚角色技能一次性延时结算，请务必<span className="red-text">填写完整所有技能的发动情况</span>，再点击"结算"<br/>
            夜晚行动顺序：灵媒-学生-男医生-道具师-女医生-女驴友-导游-管理员-(凶手)-侦探
          </small>
        </div>
        {roles.map(role=>
          <NightAction
            key={role.name}
            role={role}
          />
        )}
        <hr className="spacing-20"/>
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
              {nightActionStore.acting === 0 ? "结算" : "重新结算刀法"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default NightActor;
