import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Movement from "./movement";
import gameStore from "../../lib/store/game_store";
import placeStore from "../../lib/store/place_store";

@observer
class DayAction extends React.Component {
  constructor(props) {
    super(props);
    this.handleMove = this.handleMove.bind(this);
  }

  handleMove(location) {
    const {role} = this.props;
    if (role.movement < 1) {
      return;
    }
    role.movement--;
    if (role.location.name === location.name) {
      return;
    }
    if (location.roles.length >= location.capacity) {
      location = placeStore.getPlace("living_room");
    }
    placeStore.removeRoleFromPlace(role.location, role);
    placeStore.addRoleToPlace(location, role);
    role.location = location;
  }

  render() {
    const {role} = this.props;
    const period = gameStore.period;

    let actionPart = null;
    if (period === 1)  {
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
