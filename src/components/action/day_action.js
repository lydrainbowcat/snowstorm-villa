import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Movement from "./movement";
import Tooltip from "../common/tooltip";

import PERIOD from "../../lib/constants/period";
import gameStore from "../../lib/store/game_store";
import CommonProcessor from "../../lib/processor/common";

@observer
class DayAction extends React.Component {
  constructor(props) {
    super(props);
    this.handleMove = this.handleMove.bind(this);
  }

  handleMove(location) {
    const {role} = this.props;
    CommonProcessor.actDayMove(role, location, true);
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
          <Tooltip text={role.title}/>
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
