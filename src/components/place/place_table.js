import React from "react";
import { observer } from "mobx-react";
import PlaceRow from "./place_row";
import placeStore from "../../lib/store/place_store";
import gameStore from "../../lib/store/game_store";

@observer
class PlaceTable extends React.Component {
  render() {
    const places = placeStore.places;
    const {day} = gameStore;

    return (
      <div>
        <h5 className="text-center spacing-20">人物所在地点</h5>
        {`第${['零', '一', '二', '三', '四'][day]}天`}
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
