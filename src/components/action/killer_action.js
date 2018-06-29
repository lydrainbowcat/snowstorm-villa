import React from "react";
import PropTypes from "prop-types";
import {observer} from "mobx-react";
import {Combobox} from "react-widgets";
import gameStore from "../../lib/store/game_store";
import placeStore from "../../lib/store/place_store";
import roleStore from "../../lib/store/role_store";
import CLEWS from "../../lib/constants/clew";
import METHODS from "../../lib/constants/method";

@observer
class KillerAction extends React.Component {
  constructor(props) {
    super(props);
    this.handleActKilling = this.handleActKilling.bind(this);
    this.state = {
      targetType: "role", // 'role' or 'place'
      targetRole: null,
      targetPlace: null,
      method: null,
      clew: null
    };
  }

  handleActKilling(location) {
  }

  render() {
    const {targetType, targetRole, targetPlace, method, clew} = this.state;
    const killer = gameStore.killer;

    const roles = roleStore.roles.filter(role => role.name !== killer.name);
    const places = placeStore.places;

    const methods = METHODS.filter(method => killer.methods.indexOf(method.name) !== -1);
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
                   onChange={value => this.setState({targetType: value.currentTarget.value})}
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
              onChange={value => this.setState({targetRole: value})}
            />
          </div>
          <div className="col-2 text-right">
            <input type="radio"
                   className="spacing-inline-5"
                   value="place"
                   name="target_type_radio"
                   checked={targetType === "place"}
                   onChange={value => this.setState({targetType: value.currentTarget.value})}
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
              onChange={value => this.setState({targetPlace: value})}
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
              onChange={value => this.setState({method: value})}
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
              onChange={value => this.setState({clew: value})}
            />
          </div>
        </div>
      </div>
    );
  }
}

KillerAction.propTypes = {};

export default KillerAction;
