import React from "react";
import { observer } from "mobx-react";
import PlaceTable from "../place/place_table";
import Tooltip from "../common/tooltip";

import roleStore from "../../lib/store/role_store";
import gameStore from "../../lib/store/game_store";

import PERIOD from "../../lib/constants/period";
import placeStore from "../../lib/store/place_store";
import CommonProcessor from "../../lib/processor/common";

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
    placeStore.clearAllInformation();

    if (CommonProcessor.judgeGameForVoting(this.state.voteTarget)) {
      gameStore.setPeriod(PERIOD.GAME_OVER);
    } else {
      gameStore.setPeriod(PERIOD.NIGHT_ACT);
    }
  }

  render() {
    const roles = roleStore.roles;
    const {voteTarget} = this.state;

    return (
      <div className="container">
        <PlaceTable/>
        <h5 className="text-center spacing-20">投票阶段</h5>
        <div className="row align-items-center spacing-10">
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
          <div key={role.name} className="row align-items-center spacing-10">
            <input type="radio"
                   className="spacing-inline-5"
                   value={role.name}
                   name="voteTarget"
                   checked={voteTarget === role.name}
                   onChange={value => this.setState({voteTarget: value.currentTarget.value})}
            />
            <Tooltip text={role.title}/>
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
