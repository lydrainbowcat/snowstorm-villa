import React from "react";
import PropTypes from "prop-types";
import Movement from "./movement";

class DayAction extends React.Component {
  render() {
    const {role, period, places} = this.props;

    if (period === 1)  {
      return (
        <div className="row align-items-center spacing-10">
          <div className="col-2 text-right">
            {role.title}
          </div>
          <div className="col-8">
            <Movement
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

DayAction.propTypes = {
  role: PropTypes.object.isRequired,
  period: PropTypes.number.isRequired,
  places: PropTypes.array.isRequired
};

export default DayAction;
