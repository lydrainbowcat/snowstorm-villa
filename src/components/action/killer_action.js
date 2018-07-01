import React from "react";
import PropTypes from "prop-types";
import {observer} from "mobx-react";
import {Combobox} from "react-widgets";
import gameStore from "../../lib/store/game_store";
import placeStore from "../../lib/store/place_store";
import roleStore from "../../lib/store/role_store";
import nightActionsStore from "../../lib/store/night_actions_store"
import CLEWS from "../../lib/constants/clew";
import METHODS from "../../lib/constants/method";

@observer
class KillerAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetType: "role", // 'role' or 'place'
      targetRole: null,
      targetPlace: null,
      method: null,
      clew: null,
      trickMethod: null,
      trickClew: null
    };
  }

  render() {
    const {targetType, targetRole, targetPlace, method, clew, trickMethod, trickClew} = this.state;
    const killer = gameStore.killer;

    const roles = roleStore.roles.filter(role => role.name !== killer.name);
    const places = placeStore.places;

    //const methods = METHODS.filter(method => killer.methods.indexOf(method.name) !== -1);
    const methods = METHODS; // 在厨房可能得允许拿刀/允许溺水卫生间，这里干脆允许所有手法吧，可行不可行留作判定
    const clews = CLEWS.filter(clew => killer.clews.indexOf(clew.name) !== -1);

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
                     this.setState({targetType: value.currentTarget.value});
                     nightActionsStore.setTargetType(value.currentTarget.value);
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
                this.setState({targetRole: value});
                nightActionsStore.setTargetRole(value);
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
                     this.setState({targetType: value.currentTarget.value});
                     nightActionsStore.setTargetType(value.currentTarget.value);
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
                this.setState({targetPlace: value});
                nightActionsStore.setTargetPlace(value);
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
                this.setState({method: value});
                nightActionsStore.setMethod(value);
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
                this.setState({clew: value});
                nightActionsStore.setClew(value);
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
                this.setState({trickMethod: value});
                nightActionsStore.setTrickMethod(value);
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
                this.setState({trickClew: value});
                nightActionsStore.setTrickClew(value);
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
