import React from "react";
import PropTypes from "prop-types";

class PlaceRow extends React.Component {
  render() {
    const {place} = this.props;

    return (
      <tr>
        <td>
          {place.title}
          <span class="badge badge-secondary spacing-inline-5">
            {place.capacity < 10 ? place.capacity : "*"}
          </span>
        </td>
        <td>
          {place.roles.map(role => role.title).join("，")}
        </td>
      </tr>
    );
  }
}

PlaceRow.propTypes = {
  place: PropTypes.object
};

export default PlaceRow;
