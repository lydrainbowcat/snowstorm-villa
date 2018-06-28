import React from "react";
import PropTypes from "prop-types";
import PlaceTable from "../place/place_table";
import RoleAction from "../action/role_action";

class InitialPlaceSelector extends React.Component {
  constructor(props) {
    super(props);
    const roles = props.roles.slice(); // make a copy
    const restSize = {};
    for (let name in props.places) {
      const place = props.places[name];
      restSize[name] = place.capacity - place.roles.length;
      for (let role of place.roles) {

      }
    }
    this.state = {
      places: props.places,
      moved: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.places);
    }
  }

  handleMove(role, src, dst) {

  }

  render() {
    const {places} = this.props;
    const {roles} = this.props;
    return (
      <div className="container">
        <PlaceTable
          places={places}
        />
        {roles.map(role=>(
          <div className="flex-row">
            <RoleAction
              role={role}
              period={1}
              places={places}
            />
          </div>
          )
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
