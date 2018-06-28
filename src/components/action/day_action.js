import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Movement from "./movement";
import gameStore from "../../lib/store/game_store";

@observer
class DayAction extends React.Component {
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
