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
    if (role.location.name === location.name ||
      location.roles.length >= location.capacity) {
      return;
    }
    placeStore.removeRoleFromPlace(role.location, role);
    placeStore.addRoleToPlace(location, role);
    role.location = location;
  }

  render() {
    const {role} = this.props;
    const period = gameStore.period;

    if (period === 1)  {
      return (
        <div className="row align-items-center spacing-10">
          <div className="col-2 text-right">
            {role.title}
          </div>
          <div className="col-8">
            <Movement
              originLocation={role.location}
              disabled={role.movement < 1}
              onMove={this.handleMove}
            />
          </div>
        </div>
      );
    }
    return "";
  }
}

DayAction.propTypes = {
  role: PropTypes.object.isRequired
};

export default DayAction;
