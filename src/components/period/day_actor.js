import React from "react";
import { observer } from "mobx-react";
import PlaceTable from "../place/place_table";
import DayAction from "../action/day_action";

import roleStore from "../../lib/store/role_store";
import gameStore from "../../lib/store/game_store";

import PERIOD from "../../lib/constants/period";

@observer
class DayActor extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    roleStore.renewMovement();
    roleStore.clearKillerTrackActivatable();
    gameStore.setPeriod(PERIOD.VOTE);
  }

  render() {
    const roles = roleStore.roles;

    return (
      <div className="container">
        <PlaceTable/>
        <h5 className="text-center spacing-20">自由移动阶段</h5>
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
              进入投票
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default DayActor;
