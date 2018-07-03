import React from "react";
import {observer} from "mobx-react";
import {Combobox} from "react-widgets";

import CLEWS from "../../lib/constants/clew";
import METHODS from "../../lib/constants/method";

import gameStore from "../../lib/store/game_store";
import placeStore from "../../lib/store/place_store";
import roleStore from "../../lib/store/role_store";
import nightActionStore from "../../lib/store/night_action_store";
import KillerProcessor from "../../lib/processor/killer";

@observer
class KillerAction extends React.Component {
  render() {
    const {targetType, targetRole, targetPlace, method, clew, trickMethod, trickClew} = nightActionStore;
    const killer = gameStore.killer;

    const roles = roleStore.roles.filter(role => role.name !== killer.name);
    const places = placeStore.places;

    const methods = KillerProcessor.getAvailableMethods();
    const clews = KillerProcessor.getAvailableClews();

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
      </div>
    );
  }
}

KillerAction.propTypes = {};

export default KillerAction;
