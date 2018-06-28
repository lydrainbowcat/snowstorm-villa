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
  }

  render() {
    const {placeStore, roleStore} = this.props;
    const roles = roleStore.roles;

    return (
      <div className="container">
        <PlaceTable
          placeStore={placeStore}
        />
        <h5 className="text-center spacing-20">选择初始地点</h5>
        {roles.map(role=>
          <DayAction
            key={role.name}
            role={role}
            period={1}
            placeStore={placeStore}
          />
        )}
      </div>
    );
  }
}

InitialPlaceSelector.propTypes = {
  roleStore: PropTypes.object.isRequired,
  placeStore: PropTypes.object.isRequired
};

export default InitialPlaceSelector;
