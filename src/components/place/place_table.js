import React from "react";
import { observer } from "mobx-react";
import PlaceRow from "./place_row";
import placeStore from "../../lib/store/place_store";

@observer
class PlaceTable extends React.Component {
  render() {
    const places = placeStore.places;

    return (
      <div>
        <h5 className="text-center spacing-20">人物所在地点</h5>
        <table className="table table-striped">
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

export default PlaceTable;
