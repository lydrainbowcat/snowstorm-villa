import React from "react";
import { observer } from "mobx-react";
import PlaceTable from "../place/place_table";
import DayAction from "../action/day_action";

import roleStore from "../../lib/store/role_store";
import gameStore from "../../lib/store/game_store";
import dayActionStore from "../../lib/store/day_action_store";

import PERIOD from "../../lib/constants/period";
import GLOBAL from "../../lib/constants/global";
import CommonProcessor from "../../lib/processor/common";

@observer
class DayActor extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      hasMoved: false
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    dayActionStore.renew();
    roleStore.renewMovement();
    roleStore.clearKillerTrackActivatable();
    roleStore.clearSuppressed();
    gameStore.setPeriod(PERIOD.VOTE);
  }

  render() {
    const roles = roleStore.roles;

    return (
      <div className="container">
        <PlaceTable/>
        <h5 className="text-center spacing-20">自由移动阶段</h5>
        <div className="alert alert-info fade show alert-thin-gutters spacing-20 text-center">
          <small>
            白天技能按提交时间先后<span className="red-text">立即结算</span>，请<span className="red-text">先填写技能信息</span>再点击按钮发动<br/>
          </small>
        </div>
        {roles.map(role=>
          <DayAction
            key={role.name}
            role={role}
          />
        )}

        <div className="row">
          <div className="col text-right">
            {GLOBAL.DEBUGGING && !this.state.hasMoved &&
            <button type="button" className="btn btn-outline-primary spacing-20 spacing-inline-10"
                    onClick={() => { CommonProcessor.randomMove(); this.setState({hasMoved: true}); }}>
              随机移动
            </button>}
            <button type="button" className="btn btn-outline-success spacing-20"
                    onClick={this.handleSubmit}>
              进入投票
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default DayActor;
