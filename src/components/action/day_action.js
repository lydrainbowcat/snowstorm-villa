import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { Combobox } from "react-widgets";
import Tooltip from "../common/tooltip";

import gameStore from "../../lib/store/game_store";
import placeStore from "../../lib/store/place_store";
import dayActionStore from "../../lib/store/day_action_store";

import PERIOD from "../../lib/constants/period";
import ENUM from "../../lib/constants/enum";
import CommonProcessor from "../../lib/processor/common";
import SkillProcessor from "../../lib/processor/skill";

@observer
class DayAction extends React.Component {
  constructor(props) {
    super(props);
    this.handleMove = this.handleMove.bind(this);
    this.handleActiveKillerTrack = this.handleActiveKillerTrack.bind(this);
  }

  handleMove() {
    const {role} = this.props;
    const location = dayActionStore.getMovementOfRole(role);
    CommonProcessor.actDayMove(role, location, true);
    dayActionStore.setMovementOfRole(role, role.location);
  }

  handleActiveKillerTrack(e) {
    e.preventDefault();
    CommonProcessor.activeKillerTrack(this.props.role);
  }

  renderMovement(role) {
    const period = gameStore.period;
    const disabled = role.movement < 1;
    if (period === PERIOD.INITIAL_SELECT || period === PERIOD.DAY_ACT) {
      return <div className="col-5">
        <div className="row align-items-center col-thin-gutters">
          <div className="col-9">
            <Combobox
              data={placeStore.places}
              value={dayActionStore.getMovementOfRole(role)}
              valueField="name"
              textField="title"
              disabled={disabled}
              onChange={value => dayActionStore.setMovementOfRole(role, value)}
            />
          </div>
          <div className="col-3">
            {disabled ||
            <button className="btn btn-outline-primary btn-sm" onClick={this.handleMove}>
              移动
            </button>}
          </div>
        </div>
      </div>
    } else {
      return "";
    }
  }

  renderSkill(skillName) {
    const {role} = this.props;
    if (!SkillProcessor.judgeRoleHasSkill(role, skillName)) return ""; // 无此技能或技能无效
    const period = gameStore.period;

    switch (skillName) {
    case ENUM.SKILL.FEMALE_TOURIST_EXPLORATION:
      if (period !== PERIOD.CONFIRM_DEATH) return "";
      return <div key={skillName} className="col-5">
        <div className="row align-items-center col-thin-gutters">
          <div className="col-9">
            <Combobox
              data={placeStore.places}
              value={dayActionStore.exploration}
              valueField="name"
              textField="title"
              onChange={value => {dayActionStore.exploration = value;}}
            />
          </div>
          <div className="col-3">
            <button className="btn btn-outline-primary btn-sm" onClick={() => SkillProcessor.actExploration(role)}>
              探险精神
            </button>
          </div>
        </div>
      </div>;
    case ENUM.SKILL.MALE_TOURIST_METICULOUS:
      if (dayActionStore.usedMeticulous) return "";
      return <div className="col-2 thin-gutters">
        <button key={skillName} type="button" className="btn btn-sm btn-outline-primary" onClick={() => SkillProcessor.actMeticulous(role)}>
          缜密心思
        </button>
      </div>;
    default:
      return "";
    }
  }

  render() {
    const {role} = this.props;

    return (
      <div className="row align-items-center spacing-10">
        <div className="col-2 text-right">
          <Tooltip text={role.title}/>
        </div>
        {this.renderMovement(role)}
        {
          role.killerTrackActivatable &&
          <div className="col-2 thin-gutters">
            <button className="btn btn-outline-danger btn-sm w-100" onClick={this.handleActiveKillerTrack}>
              发现凶案
            </button>
          </div>
        }
        {role.skills.map(skillName => this.renderSkill(skillName))}
      </div>
    );
  }
}

DayAction.propTypes = {
  role: PropTypes.object.isRequired
};

export default DayAction;
