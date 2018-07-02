import React from "react";
import { observer } from "mobx-react";
import PlaceTable from "../place/place_table";
import DayAction from "../action/day_action";

import roleStore from "../../lib/store/role_store";
import gameStore from "../../lib/store/game_store";

import PERIOD from "../../lib/constants/period";
import logStore from "../../lib/store/log_store";

@observer
class Voter extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      voteTarget: "noOne"
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    const {voteTarget} = this.state;
    if (voteTarget === "noOne") {
      gameStore.setPeriod(PERIOD.NIGHT_ACT);
      return;
    }

    gameStore.setPeriod(PERIOD.GAME_OVER);
    const killer = gameStore.killer;
    const votedRole = roleStore.roles.filter(role => role.name === voteTarget)[0];
    logStore.addLog(`游戏结束，${votedRole.title}被公决。${votedRole.name === killer.name ? "受困者" : "凶手"}胜利。`);
  }

  render() {
    const roles = roleStore.roles;
    const {voteTarget} = this.state;

    return (
      <div className="container">
        <PlaceTable/>
        <h5 className="text-center spacing-20">投票阶段</h5>
        <div className="row">
          <input type="radio"
                 className="spacing-inline-5"
                 value="noOne"
                 name="voteTarget"
                 checked={voteTarget === "noOne"}
                 onChange={value => this.setState({voteTarget: value.currentTarget.value})}
          />
          公决失败
        </div>
        {roles.map(role=>
            <div className="row">
              <input type="radio"
                     className="spacing-inline-5"
                     value={role.name}
                     name="voteTarget"
                     checked={voteTarget === role.name}
                     onChange={value => this.setState({voteTarget: value.currentTarget.value})}
              />
              {role.title}
            </div>
        )}

        <div className="row">
          <div className="col text-right">
            <button type="button" className="btn btn-outline-success spacing-20"
                    onClick={this.handleSubmit}>
              表决
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Voter;
