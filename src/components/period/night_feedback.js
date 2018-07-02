import React from "react";
import { observer } from "mobx-react";
import {Combobox} from "react-widgets";
import PlaceTable from "../place/place_table";
import Utils from "../../lib/utils";

import gameStore from "../../lib/store/game_store";
import nightActionStore from "../../lib/store/night_action_store";
import placeStore from "../../lib/store/place_store";

import PERIOD from "../../lib/constants/period";

@observer
class NightFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      doJoviality: false,
      doSacrifice: false,
      doScud: false,
      scudTarget: null
    };
  }

  handleSubmit() {
    gameStore.setPeriod(PERIOD.CONFIRM_DEATH);
    nightActionStore.renew();
    placeStore.places.forEach(place => {
      Utils.roleDiscoverPlace(place, false);
    })
  }

  render() {
    const motivationName = gameStore.motivation.name;
    const {doJoviality, doSacrifice, doScud, scudTarget} = this.state;

    const targetType = nightActionStore.targetType;
    const targetRole = nightActionStore.targetRole;
    const targetPlace = nightActionStore.targetPlace;

    const places = placeStore.places;

    let motivation_actions = "";
    if (motivationName === "joviality") {
      motivation_actions = <div className="row">
        <div className="col text-left">
          <input type="checkbox"
                 checked={doJoviality}
                 onChange={value => this.setState({doJoviality: value.currentTarget.checked})}
          />
            愉悦 至{targetType === "role" ? `${targetRole.title}所在地` : targetPlace.title}
        </div>
      </div>;
    } else if (motivationName === "sacrifice") {
      motivation_actions = <div className="row">
        <div className="col text-left">
          <input type="checkbox"
                 checked={doSacrifice}
                 onChange={value => this.setState({doSacrifice: value.currentTarget.checked})}
          />
            献祭
        </div>
      </div>;
    }

    return (
      <div className="container">
        <PlaceTable/>
        {motivation_actions}
        <div className="row">
          <div className="col-4 text-left">
            <input type="checkbox"
                   checked={doScud}
                   onChange={value => this.setState({doScud: value.currentTarget.checked})}/>
              疾行
          </div>
          <div className="col-8 text-left">
            <Combobox
              data={places}
              value={scudTarget}
              valueField="name"
              textField="title"
              disabled={!doScud}
              onChange={value => this.setState({scudTarget: value})}
            />
          </div>
        </div>
        <div className="row">
          <div className="col text-right">
            <button type="button" className="btn btn-outline-success spacing-20"
                    onClick={this.handleSubmit}>
              天亮
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default NightFeedback;
