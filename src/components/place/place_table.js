import React from "react";
import PropTypes from "prop-types";
import PlaceRow from "./place_row";

class PlaceTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {places} = this.props;

    return (
      <div>
        <h5 className="text-center spacing-20">人物所在地点</h5>
        <table class="table table-striped">
          <tbody>
          {places.map(place =>
            <PlaceRow
              key={place.name}
              place={place}
            />
          )}
          </tbody>
        </table>
      </div>
    );
  }
}

PlaceTable.propTypes = {
  places: PropTypes.object.isRequired
};

export default PlaceTable;
