import React from "react";
import PropTypes from "prop-types";
import ActionMovement from "./action_movement";

class RoleAction extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {role, period, places} = this.props;

    if (period === 1)  {
      return (
        <div className="row">
          <div className="col-2">{role.title}</div>
          <div className="col-4">
            <ActionMovement
              originLocation={role.location}
              places={places}
            />
          </div>
        </div>
      );
    }
    return "";
  }
}

RoleAction.propTypes = {
  role: PropTypes.object.isRequired,
  period: PropTypes.number.isRequired,
  places: PropTypes.object.isRequired
};

export default RoleAction;
