import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import {Combobox} from "react-widgets";

import Tooltip from "../common/tooltip";
import Modal from "../common/modal";
import ENUM from "../../lib/constants/enum";

import nightActionStore from "../../lib/store/night_action_store";
import roleStore from "../../lib/store/role_store";
import placeStore from "../../lib/store/place_store";
import SkillProcessor from "../../lib/processor/skill";

@observer
class NightAction extends React.Component {
  renderSkillUI(skillName) {
    switch (skillName) {
    case ENUM.SKILL.FEMALE_DOCTOR_MIND_IMPLY_1:
      const { mindImply } = nightActionStore;
      return <div>
        <div className="row align-items-center col-thin-gutters spacing-20">
          <div className="col-1"></div>
          <div className="col">
            <input type="checkbox" className="spacing-inline-5" checked={mindImply.enabled}
                   onChange={e => nightActionStore.enableMindImply(e.target.checked)}
            />
            发动此技能
          </div>
        </div>
        <div className="row align-items-center spacing-20">
          <div className="col-2 thin-gutters text-right">对象</div>
          <div className="col-8">
            <Combobox data={roleStore.roles} value={mindImply.role} valueField="name" textField="title" disabled={!mindImply.enabled}
                      onChange={value => nightActionStore.setMindImplyRole(value)}
            />
          </div>
        </div>
        <div className="row align-items-center spacing-20">
          <div className="col-2 thin-gutters text-right">地点</div>
          <div className="col-8">
            <Combobox data={placeStore.places} value={mindImply.place} valueField="name" textField="title" disabled={!mindImply.enabled}
                      onChange={value => nightActionStore.setMindImplyPlace(value)}
            />
          </div>
        </div>
      </div>;

    case ENUM.SKILL.MALE_DOCTOR_BRAIN_DIAGNOSIS:
      const { brainDiagnosis } = nightActionStore;
      return <div>
        <div className="row align-items-center col-thin-gutters spacing-20">
          <div className="col-1"></div>
          <div className="col-3 text-center">
            <input type="radio" className="spacing-inline-5" checked={brainDiagnosis.enabled === 0}
                   onChange={e => nightActionStore.enableBrainDiagnosis(0)}
            />
            不发动
          </div>
          <div className="col-3 text-center">          
            <input type="radio" className="spacing-inline-5" checked={brainDiagnosis.enabled === 1}
                   onChange={e => nightActionStore.enableBrainDiagnosis(1)}
            />
            发动效果1
          </div>
          <div className="col-3 text-center">
            <input type="radio" className="spacing-inline-5" checked={brainDiagnosis.enabled === 2}
                   onChange={e => nightActionStore.enableBrainDiagnosis(2)}
            />
            发动效果2
          </div>
        </div>
        <div className="row align-items-center spacing-20">
          <div className="col-2 thin-gutters text-right">对象1</div>
          <div className="col-8">
            <Combobox data={roleStore.roles} value={brainDiagnosis.enabled ? brainDiagnosis.targets[0] : null}
                      valueField="name" textField="title" disabled={brainDiagnosis.enabled === 0}
                      onChange={value => nightActionStore.addBrainDiagnosisTarget(0, value)}
            />
          </div>
        </div>
        <div className="row align-items-center spacing-20">
          <div className="col-2 thin-gutters text-right">对象2</div>
          <div className="col-8">
            <Combobox data={roleStore.roles} value={brainDiagnosis.enabled ? brainDiagnosis.targets[1] : null}
                      valueField="name" textField="title" disabled={brainDiagnosis.enabled !== 1}
                      onChange={value => nightActionStore.addBrainDiagnosisTarget(1, value)}
            />
          </div>
        </div>
      </div>;

    default:
      return null;
    }
  }

  renderSummary(skillName) {
    switch (skillName) {
    case ENUM.SKILL.FEMALE_DOCTOR_MIND_IMPLY_1:
      return nightActionStore.mindImplySummary;
    case ENUM.SKILL.MALE_DOCTOR_BRAIN_DIAGNOSIS:
      return nightActionStore.brainDiagnosisSummary;
    default:
      return null;
    }
  }

  renderSkill(skillName) {
    const {role} = this.props;
    if (!SkillProcessor.judgeRoleHasSkill(role, skillName)) return ""; // 无此技能或技能无效

    const innerElement = this.renderSkillUI(skillName);
    if (innerElement === null) return ""; // 非夜晚技能
    
    const skill = SkillProcessor.getSkill(skillName);
    if (innerElement === "") { // 只需一个按钮
      return <button key={skillName} type="button" className="btn btn-sm btn-outline-primary">
        {skill.title}
      </button>;
    }

    return <Modal // 需要弹出界面操作
      key={skillName}
      id={`${role.name}_${skillName}`}
      buttonText={skill.title}
      title={`${role.title}：${skill.title}`}
      innerElement={innerElement}
      summary={this.renderSummary(skillName)}
    />;
  }

  render() {
    const {role} = this.props;

    return (
      <div className="row align-items-center spacing-10">
        <div className="col-2 text-right">
          <Tooltip text={role.title}/>
        </div>
        <div className="col-8">
          {role.skills.map(skillName => this.renderSkill(skillName))}
        </div>
      </div>
    );
  }
}

NightAction.propTypes = {
  role: PropTypes.object.isRequired
};

export default NightAction;
