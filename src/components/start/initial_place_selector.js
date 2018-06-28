import React from "react";
import { observer } from "mobx-react";
import {Combobox} from "react-widgets";
import PlaceTable from "../place/place_table";
import DayAction from "../action/day_action";
import MOTIVATIONS from "../../lib/constants/motivation";
import METHODS from "../../lib/constants/method";
import CLEWS from "../../lib/constants/clew";
import roleStore from "../../lib/store/role_store";
import gameStore from "../../lib/store/game_store";

@observer
class InitialPlaceSelector extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      motivation: "joviality",
      premeditation_type: "method", // 预谋 手法 method 或 线索 clew
      premeditation_method: "",
      premeditation_clew: ""
    };
  }

  handleSubmit() {
    gameStore.setPeriod(2);
  }

  render() {
    const {motivation, premeditation_type} = this.state;

    const roles = roleStore.roles;
    const premeditation_methods = METHODS.filter(method => method.can_be_premeditated === 1);
    const premeditation_clews = CLEWS.slice(); // TODO: 确定凶手后，过滤仅保留凶手没有的线索

    return (
      <div className="container">
        <PlaceTable/>
        <h5 className="text-center spacing-20">选择初始地点</h5>
        {roles.map(role=>
          <DayAction
            key={role.name}
            role={role}
          />
        )}
        <div className="row align-items-center spacing-10">
          <div className="col-2 text-right">
            动机
          </div>
          <div className="col-5">
            <Combobox
              data={MOTIVATIONS}
              value={motivation}
              valueField="name"
              textField="title"
              onChange={value => this.setState({motivation: value.name})}
            />
          </div>
        </div>
        {motivation === 'premeditation' && (
          <div className="row align-items-center spacing-10">
            <div className="col-2 text-right">
              <input type="radio"
                     value="method"
                     name="premeditation_type_radio"
                     checked={premeditation_type === "method"}
                     onChange={value => this.setState({premeditation_type: value.currentTarget.value})}
              />
              手法
            </div>
            <div className="col-4">
              <Combobox
                data={premeditation_methods}
                valueField="name"
                textField="title"
                onChange={value => this.setState({premeditation_method: value})}
              />
            </div>
            <div className="col-2 text-right">
              <input type="radio"
                     value="clew"
                     name="premeditation_type_radio"
                     checked={premeditation_type === "clew"}
                     onChange={value => this.setState({premeditation_type: value.currentTarget.value})}
              />
              线索
            </div>
            <div className="col-4">
              <Combobox
                data={premeditation_clews}
                valueField="name"
                textField="title"
                onChange={value => this.setState({premeditation_clew: value})}
              />
            </div>
          </div>
          )}
        <div className="row">
          <div className="col text-right">
            <button type="button" className="btn btn-outline-primary spacing-20"
                    onClick={this.handleSubmit}>
              入夜
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default InitialPlaceSelector;
