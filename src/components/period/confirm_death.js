import React from "react";
import { observer } from "mobx-react";
import PlaceTable from "../place/place_table";
import DayAction from "../action/day_action";

import PERIOD from "../../lib/constants/period";

import archive from "../../lib/store/archive";
import roleStore from "../../lib/store/role_store";
import gameStore from "../../lib/store/game_store";

@observer
class ConfirmDeath extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    gameStore.setPeriod(PERIOD.DAY_ACT);
    archive.save();
  }

  render() {
    const roles = roleStore.roles;

    return (
      <div className="container">
        <PlaceTable/>
        <h5 className="text-center spacing-20">确认死者阶段</h5>
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
            <button type="button" className="btn btn-outline-success spacing-20"
                    onClick={this.handleSubmit}>
              开始移动
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmDeath;
