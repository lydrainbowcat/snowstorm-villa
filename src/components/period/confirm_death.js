import React from "react";
import { observer } from "mobx-react";
import PlaceTable from "../place/place_table";
import DayAction from "../action/day_action";

import PERIOD from "../../lib/constants/period";
import roleStore from "../../lib/store/role_store";
import gameStore from "../../lib/store/game_store";
import placeStore from "../../lib/store/place_store";

@observer
class ConfirmDeath extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    placeStore.clearBackup();
    gameStore.setPeriod(PERIOD.DAY_ACT);
  }

  render() {
    const roles = roleStore.roles;

    return (
      <div className="container">
        <PlaceTable/>
        <h5 className="text-center spacing-20">确认死者阶段</h5>
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
