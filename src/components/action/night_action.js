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

    case ENUM.SKILL.FEMALE_TOURIST_INVITATION:
      const { invitation } = nightActionStore;
      return <div>
        <div className="row align-items-center col-thin-gutters spacing-20">
          <div className="col-1"></div>
          <div className="col">
            <input type="checkbox" className="spacing-inline-5" checked={invitation.enabled}
                   onChange={e => nightActionStore.enableInvitation(e.target.checked)}
            />
            发动此技能
          </div>
        </div>
        <div className="row align-items-center spacing-20">
          <div className="col-2 thin-gutters text-right">对象</div>
          <div className="col-8">
            <Combobox data={roleStore.roles.filter(role => role.name !== ENUM.ROLE.FEMALE_TOURIST)} value={invitation.role} valueField="name" textField="title"
                      disabled={!invitation.enabled} onChange={value => nightActionStore.setInvitationRole(value)}
            />
          </div>
        </div>
        <div className="row align-items-center spacing-20">
          <div className="col-2 thin-gutters text-right">地点</div>
          <div className="col-8">
            <Combobox data={placeStore.places} value={invitation.place} valueField="name" textField="title" disabled={!invitation.enabled}
                      onChange={value => nightActionStore.setInvitationPlace(value)}
            />
          </div>
        </div>
      </div>;

    case ENUM.SKILL.GUIDE_SAFE_CHECK:
      const { safeCheck } = nightActionStore;
      return <div>
        <div className="row align-items-center col-thin-gutters spacing-20">
          <div className="col-1"></div>
          <div className="col">
            <input type="checkbox" className="spacing-inline-5" checked={safeCheck.enabled}
                  onChange={e => nightActionStore.enableSafeCheck(e.target.checked)}
            />
            发动此技能
          </div>
        </div>
        <div className="row align-items-center spacing-20">
          <div className="col-2 thin-gutters text-right">地点</div>
          <div className="col-8">
            <Combobox data={placeStore.places} value={safeCheck.place} valueField="name" textField="title" disabled={!safeCheck.enabled}
                      onChange={value => nightActionStore.setSafeCheckPlace(value)}
            />
          </div>
        </div>
      </div>;

    case ENUM.SKILL.CONJURATOR_WHITSUNDAYS:
      return "";

    case ENUM.SKILL.PROPSMAN_SHOW_MECHANISM:
      const { mechanism } = nightActionStore;
      return <div>
        <div className="row align-items-center col-thin-gutters spacing-20">
          <div className="col-1"></div>
          <div className="col">
            <input type="checkbox" className="spacing-inline-5" checked={mechanism.enabled}
                  onChange={e => nightActionStore.enableMechanism(e.target.checked)}
            />
            发动此技能
          </div>
        </div>
        <div className="row align-items-center spacing-20">
          <div className="col-2 thin-gutters text-right">地点</div>
          <div className="col-8">
            <Combobox data={placeStore.places} value={mechanism.place} valueField="name" textField="title" disabled={!mechanism.enabled}
                      onChange={value => nightActionStore.setMechanismPlace(value)}
            />
          </div>
        </div>
      </div>;

    case ENUM.SKILL.PROPSMAN_SHOW_FRIGHTEN:
      const { frighten } = nightActionStore;
      const smallPlaces = placeStore.places.filter(place => place.capacity <= 2);
      return <div>
        <div className="row align-items-center col-thin-gutters spacing-20">
          <div className="col-1"></div>
          <div className="col">
            <input type="checkbox" className="spacing-inline-5" checked={frighten.enabled}
                  onChange={e => nightActionStore.enableFrighten(e.target.checked)}
            />
            发动此技能
          </div>
        </div>
        <div className="row align-items-center spacing-20">
          <div className="col-2 thin-gutters text-right">地点</div>
          <div className="col-8">
            <Combobox data={smallPlaces} value={frighten.place} valueField="name" textField="title" disabled={!frighten.enabled}
                      onChange={value => nightActionStore.setFrightenPlace(value)}
            />
          </div>
        </div>
      </div>;

    case ENUM.SKILL.PROPSMAN_SHOW_DOLL:
      return "";

    case ENUM.SKILL.STUDENT_NIGHTMARE:
      const { nightmare } = nightActionStore;
      return <div>
        <div className="row align-items-center col-thin-gutters spacing-20">
          <div className="col-1"></div>
          <div className="col-3 text-center">
            <input type="radio" className="spacing-inline-5" checked={nightmare.enabled === 0}
                  onChange={e => nightActionStore.enableNightmare(0)}
            />
            不发动
          </div>
          <div className="col-3 text-center">          
            <input type="radio" className="spacing-inline-5" checked={nightmare.enabled === 1}
                  onChange={e => nightActionStore.enableNightmare(1)}
            />
            发动效果1
          </div>
          <div className="col-3 text-center">
            <input type="radio" className="spacing-inline-5" checked={nightmare.enabled === 2}
                  onChange={e => nightActionStore.enableNightmare(2)}
            />
            发动效果2
          </div>
        </div>
        <div className="row align-items-center spacing-20">
          <div className="col-2 thin-gutters text-right">地点</div>
          <div className="col-8">
            <Combobox data={placeStore.places} value={nightmare.enabled ? nightmare.place : null}
                      valueField="name" textField="title" disabled={nightmare.enabled === 0}
                      onChange={value => nightActionStore.setNightmarePlace(value)}
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
    case ENUM.SKILL.FEMALE_TOURIST_INVITATION:
      return nightActionStore.invitationSummary;
    case ENUM.SKILL.GUIDE_SAFE_CHECK:
      return nightActionStore.safeCheckSummary;
    case ENUM.SKILL.PROPSMAN_SHOW_MECHANISM:
      return nightActionStore.mechanismSummary;
    case ENUM.SKILL.PROPSMAN_SHOW_FRIGHTEN:
      return nightActionStore.frightenSummary;
    case ENUM.SKILL.STUDENT_NIGHTMARE:
      return nightActionStore.nightmareSummary;
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
    if (innerElement === "") { // 不需要弹出界面操作
      switch (skillName) {
      case ENUM.SKILL.CONJURATOR_WHITSUNDAYS:
        if (roleStore.deadRoles.length === 0) return "";
        return <div key={skillName} className="col-7">
          <div className="row align-items-center col-thin-gutters">
            <div className="col-9">
              <Combobox
                data={roleStore.deadRoles}
                value={nightActionStore.whitsundays.role}
                valueField="name"
                textField="title"
                onChange={value => {nightActionStore.whitsundays.role = value;}}
              />
            </div>
            <div className="col-3">
              <button className="btn btn-outline-primary btn-sm" onClick={() => SkillProcessor.actWhitsundays(role)}>
                执行降灵
              </button>
            </div>
          </div>
        </div>;
      case ENUM.SKILL.PROPSMAN_SHOW_DOLL:
        return <button key={skillName} className="spacing-inline-5 btn btn-sm btn-outline-primary" disabled>
          <input type="checkbox"
                 className="spacing-inline-5"
                 checked={nightActionStore.useDoll}
                 onChange={() => { nightActionStore.useDoll = !nightActionStore.useDoll; }}
          />
          {skill.title}
        </button>;
      default:
        return "";
      }
    }

    return <Modal // 需要弹出界面操作
      key={skillName}
      id={`${role.name}_${skillName}`}
      className={"spacing-inline-5"}
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
