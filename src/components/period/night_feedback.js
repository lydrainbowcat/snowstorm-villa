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

  handleSubmit(e) {
    e.preventDefault();
    gameStore.setPeriod(PERIOD.CONFIRM_DEATH);
    nightActionStore.renew();
    placeStore.places.forEach(place => {
      Utils.dayDiscoverPlace(place, null);
    })
  }

  render() {
    const motivationName = gameStore.motivation.name;
    const {doJoviality, doSacrifice, doScud, scudTarget} = this.state;
    const {targetType, targetRole, targetPlace} = nightActionStore;
    const places = placeStore.places;

    let motivationActions = "";
    if (motivationName === "joviality") {
      const jovialityPlace = targetType === "role" ? `${targetRole.title}所在地` : targetPlace.title;
      motivationActions = <span>
        <input type="checkbox"
               class="spacing-inline-5"
               checked={doJoviality}
               onChange={value => this.setState({doJoviality: value.currentTarget.checked})}
        />
        {`<愉悦>至${jovialityPlace}`}
      </span>;
    } else if (motivationName === "sacrifice") {
      motivationActions = <span>
        <input type="checkbox"
               class="spacing-inline-5"
               checked={doSacrifice}
               onChange={value => this.setState({doSacrifice: value.currentTarget.checked})}
        />
        {"发动技能<献祭>"}
      </span>;
    }

    return (
      <div className="container">
        <PlaceTable/>
        <h5 className="text-center spacing-20">作案后行动</h5>
        <div className="row spacing-20">
          <div className="col text-left">
            {motivationActions}
          </div>
        </div>
        <div className="row align-items-center spacing-20">
          <div className="col-3 text-left">
            <input type="checkbox"
                   class="spacing-inline-5"
                   checked={doScud}
                   onChange={value => this.setState({doScud: value.currentTarget.checked})}/>
            {`<疾行>至`}
          </div>
          <div className="col-7 text-left">
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
