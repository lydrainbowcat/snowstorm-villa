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
    this.handleActiveKillerTrack = this.handleActiveKillerTrack.bind(this);
  }

  handleMove(location) {
    const {role} = this.props;
    CommonProcessor.actDayMove(role, location, true);
  }

  handleActiveKillerTrack(e) {
    e.preventDefault();
    CommonProcessor.activeKillerTrack(this.props.role);
  }

  render() {
    const {role} = this.props;
    const period = gameStore.period;

    let movementPart = null;
    if (period === PERIOD.INITIAL_SELECT || period === PERIOD.DAY_ACT)  {
      movementPart = <Movement
        originLocation={role.location}
        disabled={role.movement < 1}
        onMove={this.handleMove}
      />;
    } else {
      movementPart = "无行动可用";
    }

    return (
      <div className="row align-items-center spacing-10">
        <div className="col-2 text-right">
          <Tooltip text={role.title}/>
        </div>
        <div className="col-8">
          <div className="row">
            <div className="col-10">
              {movementPart}
            </div>
            {role.killerTrackActivatable && (
              <div className="col-2 text-right">
                <button className="btn btn-outline-primary" onClick={this.handleActiveKillerTrack}>
                  发现凶案
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

DayAction.propTypes = {
  role: PropTypes.object.isRequired
};

export default DayAction;
