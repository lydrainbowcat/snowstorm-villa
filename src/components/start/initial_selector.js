import React from "react";
import { observer } from "mobx-react";
import {Combobox} from "react-widgets";
import PlaceTable from "../place/place_table";
import DayAction from "../action/day_action";

import MOTIVATIONS from "../../lib/constants/motivation";
import METHODS from "../../lib/constants/method";
import CLEWS from "../../lib/constants/clew";
import PERIOD from "../../lib/constants/period";
import GLOBAL from "../../lib/constants/global";

import roleStore from "../../lib/store/role_store";
import gameStore from "../../lib/store/game_store";
import logStore from "../../lib/store/log_store";
import KillerProcessor from "../../lib/processor/killer";
import CommonProcessor from "../../lib/processor/common";

@observer
class InitialSelector extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      motivation: "joviality",
      premeditationType: "method", // 预谋 手法 method 或 线索 clew
      premeditationMethod: null,
      premeditationClew: null,
      hasMoved: false,
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const motivation = this.state.motivation;
    const type = this.state.premeditationType;
    const detail = type === "method" ? this.state.premeditationMethod : this.state.premeditationClew;
    if (motivation === "premeditation" && detail == null) {
      return;
    }

    const log = KillerProcessor.setMotivation(motivation, type, detail);
    logStore.addLog(log, 1);
    roleStore.renewMovement();
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
            {GLOBAL.DEBUGGING && !this.state.hasMoved &&
            <button type="button" className="btn btn-outline-primary spacing-20 spacing-inline-10"
                    onClick={() => { CommonProcessor.randomMove(); this.setState({hasMoved: true}); }}>
              随机移动
            </button>}
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
