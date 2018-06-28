import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
class PlaceRow extends React.Component {
  render() {
    const {place} = this.props;

    return (
      <tr className="row">
        <td className="col-3">
          {place.title}
          <span className="badge badge-secondary spacing-inline-5">
            {place.capacity < 10 ? place.capacity : "*"}
          </span>
        </td>
        <td className="col">
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
