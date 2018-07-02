import React from "react";
import {observer} from "mobx-react";
import {Combobox} from "react-widgets";
import gameStore from "../../lib/store/game_store";
import placeStore from "../../lib/store/place_store";
import roleStore from "../../lib/store/role_store";
import nightActionStore from "../../lib/store/night_action_store"
import CLEWS from "../../lib/constants/clew";
import METHODS from "../../lib/constants/method";
import GLOBAL from "../../lib/constants/global";
import Utils from "../../lib/utils";

@observer
class KillerAction extends React.Component {
  constructor(props) {
    super(props);
    this.handleRandomKill = this.handleRandomKill.bind(this);
  }

  handleRandomKill() {
    const killer = gameStore.killer;
    const methodName = Utils.randElementExceptIn(killer.methods, [gameStore.lastMethodName]);
    const clewName = Utils.randElementExceptIn(killer.clews, gameStore.usedClewsName);

    nightActionStore.setTargetType(['role', 'place'][Utils.randInt(2)]);
    nightActionStore.setTargetRole(Utils.randElementExceptNameIn(roleStore.roles, [killer.name]));
    nightActionStore.setTargetPlace(Utils.randElement(placeStore.places));
    nightActionStore.setMethod(METHODS.filter(method => method.name === methodName)[0]);
    nightActionStore.setClew(CLEWS.filter(clew => clew.name === clewName)[0]);
    nightActionStore.setTrickMethod(Utils.randElement(METHODS));
    nightActionStore.setTrickClew(Utils.randElement(CLEWS));
  }

  render() {
    const DEBUGGING = GLOBAL.DEBUGGING;

    const {targetType, targetRole, targetPlace, method, clew, trickMethod, trickClew} = nightActionStore;
    const killer = gameStore.killer;

    const roles = roleStore.roles.filter(role => role.name !== killer.name);
    const places = placeStore.places;

    // 在厨房可能得允许拿刀/允许溺水卫生间，这里允许所有手法，可行不可行留作判定
    const methods = METHODS.filter(method => method.name !== gameStore.lastMethodName);
    const clews = CLEWS.filter(clew => killer.clews.indexOf(clew.name) !== -1).filter(clew => gameStore.usedClewsName.indexOf(clew.name) === -1);

    return (
      <div className="container">
        <h5 className="text-center spacing-20">刀法</h5>
        <div className="row align-items-center spacing-10">
          <div className="col-2 text-right">
            <input type="radio"
                   className="spacing-inline-5"
                   value="role"
                   name="target_type_radio"
                   checked={targetType === "role"}
                   onChange={value => {
                     nightActionStore.setTargetType(value.currentTarget.value);
                   }}
            />
            点杀
          </div>
          <div className="col-4">
            <Combobox
              data={roles}
              value={targetRole}
              valueField="name"
              textField="title"
              disabled={targetType !== "role"}
              onChange={value => {
                nightActionStore.setTargetRole(value);
              }}
            />
          </div>
          <div className="col-2 text-right">
            <input type="radio"
                   className="spacing-inline-5"
                   value="place"
                   name="target_type_radio"
                   checked={targetType === "place"}
                   onChange={value => {
                     nightActionStore.setTargetType(value.currentTarget.value);
                   }}
            />
            群杀
          </div>
          <div className="col-4">
            <Combobox
              data={places}
              value={targetPlace}
              valueField="name"
              textField="title"
              disabled={targetType !== "place"}
              onChange={value => {
                nightActionStore.setTargetPlace(value);
              }}
            />
          </div>
        </div>
        <div className="row align-items-center spacing-10">
          <div className="col-2 text-right">
            手法
          </div>
          <div className="col-4">
            <Combobox
              data={methods}
              value={method}
              valueField="name"
              textField="title"
              onChange={value => {
                nightActionStore.setMethod(value);
              }}
            />
          </div>
          <div className="col-2 text-right">
            线索
          </div>
          <div className="col-4">
            <Combobox
              data={clews}
              value={clew}
              valueField="name"
              textField="title"
              onChange={value => {
                nightActionStore.setClew(value);
              }}
            />
          </div>
        </div>
        <div className="row align-items-center spacing-10">
          <div className="col-2 text-right">
            假手法
          </div>
          <div className="col-4">
            <Combobox
              data={METHODS}
              value={trickMethod}
              valueField="name"
              textField="title"
              onChange={value => {
                nightActionStore.setTrickMethod(value);
              }}
            />
          </div>
          <div className="col-2 text-right">
            假线索
          </div>
          <div className="col-4">
            <Combobox
              data={CLEWS}
              value={trickClew}
              valueField="name"
              textField="title"
              onChange={value => {
                nightActionStore.setTrickClew(value);
              }}
            />
          </div>
        </div>
        {DEBUGGING && (
          <div className="row">
            <div className="col text-left">
              <button type="button" className="btn btn-outline-success spacing-20"
                      onClick={this.handleRandomKill}>
                随机行凶
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

KillerAction.propTypes = {};

export default KillerAction;
