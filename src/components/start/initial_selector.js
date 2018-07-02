import React from "react";
import { observer } from "mobx-react";
import {Combobox} from "react-widgets";
import PlaceTable from "../place/place_table";
import DayAction from "../action/day_action";
import MOTIVATIONS from "../../lib/constants/motivation";
import METHODS from "../../lib/constants/method";
import CLEWS from "../../lib/constants/clew";
import PERIOD from "../../lib/constants/period";
import roleStore from "../../lib/store/role_store";
import gameStore from "../../lib/store/game_store";
import logStore from "../../lib/store/log_store";
import Utils from "../../lib/utils";

@observer
class InitialSelector extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      motivation: "joviality",
      premeditationType: "method", // 预谋 手法 method 或 线索 clew
      premeditationMethod: null,
      premeditationClew: null
    };
  }

  handleSubmit() {
    const motivation = this.state.motivation;
    const type = this.state.premeditationType;
    const detail = type === "method" ? this.state.premeditationMethod :this.state.premeditationClew;
    if (motivation === "premeditation" && detail == null) {
      return;
    }

    gameStore.setMotivation(motivation);
    let log = `凶手选择了动机<${gameStore.motivation.title}>`;
    if (motivation === "premeditation") {
      log += `，预谋${type === "method" ? "手法" : "线索"}为<${detail.title}>`;
      // 把预谋手法或线索加入凶手人物模板
      if (type === "method") gameStore.killer.methods.push(detail.name);
      else gameStore.killer.clews.push(detail.name);
    }
    logStore.addLog(log, 1);

    Utils.renewMovement();
    gameStore.setPeriod(PERIOD.NIGHT_ACT);
  }

  render() {
    const roles = roleStore.roles;
    const {motivation, premeditationType} = this.state;
    const premeditationMethods = METHODS.filter(method =>
      method["can_be_premeditated"] === 1 && gameStore.killer.methods.indexOf(method.name) === -1
    );
    const premeditationClews = CLEWS.filter(clew =>
      gameStore.killer.clews.indexOf(clew.name) === -1
    );

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
        <h5 className="text-center spacing-20">选择作案动机</h5>
        <div className="row align-items-center">
          <div className="col-2 text-right">
            动机
          </div>
          <div className="col-6">
            <Combobox
              data={MOTIVATIONS}
              value={motivation}
              valueField="name"
              textField="title"
              onChange={value => this.setState({motivation: value.name})}
            />
          </div>
        </div>
        {motivation === "premeditation" && (
          <div className="row align-items-center spacing-10">
            <div className="col-2 text-right">
              <input type="radio"
                     className="spacing-inline-5"
                     value="method"
                     name="premeditation_type_radio"
                     checked={premeditationType === "method"}
                     onChange={value => this.setState({premeditationType: value.currentTarget.value})}
              />
              手法
            </div>
            <div className="col-4">
              <Combobox
                data={premeditationMethods}
                value={this.state.premeditationMethod}
                valueField="name"
                textField="title"
                disabled={premeditationType !== "method"}
                onChange={value => this.setState({premeditationMethod: value})}
              />
            </div>
            <div className="col-2 text-right">
              <input type="radio"
                     className="spacing-inline-5"
                     value="clew"
                     name="premeditation_type_radio"
                     checked={premeditationType === "clew"}
                     onChange={value => this.setState({premeditationType: value.currentTarget.value})}
              />
              线索
            </div>
            <div className="col-4">
              <Combobox
                data={premeditationClews}
                value={this.state.premeditationClew}
                valueField="name"
                textField="title"
                disabled={premeditationType !== "clew"}
                onChange={value => this.setState({premeditationClew: value})}
              />
            </div>
          </div>
          )}
        <div className="row">
          <div className="col text-right">
            <button type="button" className="btn btn-outline-success spacing-20"
                    onClick={this.handleSubmit}>
              入夜
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default InitialSelector;
