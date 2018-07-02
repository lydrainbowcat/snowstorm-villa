import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Movement from "./movement";
import Utils from "../../lib/utils";

import gameStore from "../../lib/store/game_store";
import PERIOD from "../../lib/constants/period";

@observer
class DayAction extends React.Component {
  constructor(props) {
    super(props);
    this.handleMove = this.handleMove.bind(this);
  }

  handleMove(location) {
    const {role} = this.props;
    if (Utils.actMove(role, location)) { // 进行移动
      Utils.dayDiscoverPlace(role.location, role); // 移动后判断是否能收到线索
    }
  }

  render() {
    const {role} = this.props;
    const period = gameStore.period;

    let actionPart = null;
    if (period === PERIOD.INITIAL_SELECT || period === PERIOD.DAY_ACT)  {
      actionPart = <Movement
        originLocation={role.location}
        disabled={role.movement < 1}
        onMove={this.handleMove}
      />;
    } else {
      actionPart = "无行动可用";
    }

    return (
      <div className="row align-items-center spacing-10">
        <div className="col-2 text-right">
          {role.title}
        </div>
        <div className="col-8">
          {actionPart}
        </div>
      </div>
    );
  }
}

DayAction.propTypes = {
  role: PropTypes.object.isRequired
};

export default DayAction;
