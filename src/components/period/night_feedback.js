import React from "react";
import { observer } from "mobx-react";
import {Combobox} from "react-widgets";
import PlaceTable from "../place/place_table";

import gameStore from "../../lib/store/game_store";
import nightActionStore from "../../lib/store/night_action_store";
import placeStore from "../../lib/store/place_store";

import PERIOD from "../../lib/constants/period";
import CommonProcessor from "../../lib/processor/common";

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

    const {doJoviality, doSacrifice, doScud, scudTarget} = this.state;
    const {targetType, targetRole, targetPlace} = nightActionStore;
    const killer = gameStore.killer;

    // 愉悦
    if (doJoviality) {
      const jovialityTargetPlace = targetType === "place" ? targetPlace : targetRole.location;
      CommonProcessor.actNightMove(killer, jovialityTargetPlace);
    }

    // 疾行
    if (doScud) {
      CommonProcessor.actNightMove(killer, scudTarget);
      gameStore.setScudUsed(true);
    }

    // 献祭
    gameStore.setKillerSacrificing(doSacrifice);

    CommonProcessor.discoverPlacesAtDawn();
    nightActionStore.renew();

    gameStore.nextDay();
    gameStore.setPeriod(PERIOD.CONFIRM_DEATH);
  }

  render() {
    const motivationName = gameStore.motivation.name;
    const scudUsed = gameStore.scudUsed;
    const {doJoviality, doSacrifice, doScud, scudTarget} = this.state;
    const {targetType, targetRole, targetPlace, canJoviality} = nightActionStore;
    const places = placeStore.places;

    let jovialityDisplay = "行凶失败，无法发动愉悦";
    if (canJoviality) {
      jovialityDisplay = <div className="col text-left">
        <input type="checkbox"
               className="spacing-inline-5"
               checked={doJoviality}
               onChange={value => this.setState({doJoviality: value.currentTarget.checked})}
        />
        {`<愉悦>至${targetType === "role" ? `${targetRole.title}所在地` : targetPlace.title}`}
      </div>;
    }

    return (
      <div className="container">
        <PlaceTable/>
        <h5 className="text-center spacing-20">作案后行动</h5>
        {motivationName === "joviality" && (
          <div className="row spacing-20">
            {jovialityDisplay}
          </div>
        )}
        {!scudUsed && (
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
        )}
        {motivationName === "sacrifice" && (
          <div className="row spacing-20">
            <div className="col text-left">
              <input type="checkbox"
                     class="spacing-inline-5"
                     checked={doSacrifice}
                     onChange={value => this.setState({doSacrifice: value.currentTarget.checked})}
              />
              {"发动技能<献祭>"}
            </div>
          </div>
        )}
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
