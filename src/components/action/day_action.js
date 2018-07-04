import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { Combobox } from "react-widgets";
import Tooltip from "../common/tooltip";

import PERIOD from "../../lib/constants/period";
import gameStore from "../../lib/store/game_store";
import placeStore from "../../lib/store/place_store";
import CommonProcessor from "../../lib/processor/common";
import dayActionStore from "../../lib/store/day_action_store";

@observer
class DayAction extends React.Component {
  constructor(props) {
    super(props);
    this.handleMove = this.handleMove.bind(this);
    this.handleActiveKillerTrack = this.handleActiveKillerTrack.bind(this);
  }

  handleMove() {
    const {role} = this.props;
    const location = dayActionStore.getMovementOfRole(role);
    CommonProcessor.actDayMove(role, location, true);
    dayActionStore.setMovementOfRole(role, role.location);
  }

  handleActiveKillerTrack(e) {
    e.preventDefault();
    CommonProcessor.activeKillerTrack(this.props.role);
  }

  renderMovement(role) {
    const period = gameStore.period;
    const disabled = role.movement < 1;
    if (period === PERIOD.INITIAL_SELECT || period === PERIOD.DAY_ACT) {
      return <div className="col-5">
        <div className="row align-items-center col-thin-gutters">
          <div className="col-9">
            <Combobox
              data={placeStore.places}
              value={dayActionStore.getMovementOfRole(role)}
              valueField="name"
              textField="title"
              disabled={disabled}
              onChange={value => dayActionStore.setMovementOfRole(role, value)}
            />
          </div>
          <div className="col-3">
            {disabled ||
            <button className="btn btn-outline-primary btn-sm" onClick={this.handleMove}>
              移动
            </button>}
          </div>
        </div>
      </div>
    } else {
      return "";
    }
  }

  render() {
    const {role} = this.props;

    return (
      <div className="row align-items-center spacing-10">
        <div className="col-2 text-right">
          <Tooltip text={role.title}/>
        </div>
        {this.renderMovement(role)}
        {
          role.killerTrackActivatable &&
          <div className="col-2 thin-gutters">
            <button className="btn btn-outline-danger btn-sm w-100" onClick={this.handleActiveKillerTrack}>
              发现凶案
            </button>
          </div>
        }
        {
          <div className="col-2 thin-gutters">
            <button className="btn btn-outline-primary btn-sm">
              test
            </button>
          </div>
        }
      </div>
    );
  }
}

DayAction.propTypes = {
  role: PropTypes.object.isRequired
};

export default DayAction;
