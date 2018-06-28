import React from "react";
import PropTypes from "prop-types";
import PlaceTable from "../place/place_table";
import DayAction from "../action/day_action";

class InitialPlaceSelector extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.places);
    }
  }

  render() {
    const {places, roles} = this.props;

    return (
      <div className="container">
        <PlaceTable
          places={places}
        />
        <h5 className="text-center spacing-20">选择初始地点</h5>
        {roles.map(role=>
          <DayAction
            key={role.name}
            role={role}
            period={1}
            places={places}
          />
        )}
      </div>
    );
  }
}

InitialPlaceSelector.propTypes = {
  roles: PropTypes.object.isRequired,
  places: PropTypes.object.isRequired,
  onSubmit: PropTypes.func
};

export default InitialPlaceSelector;
