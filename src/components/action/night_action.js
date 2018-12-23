import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import {DropdownList} from "react-widgets";

import Tooltip from "../common/tooltip";
import ENUM from "../../lib/constants/enum";

import gameStore from "../../lib/store/game_store";
import nightActionStore from "../../lib/store/night_action_store";
import roleStore from "../../lib/store/role_store";
import placeStore from "../../lib/store/place_store";
import SkillProcessor from "../../lib/processor/skill";

@observer
class NightAction extends React.Component {
  renderSkill(skillName) {
    const {role} = this.props;
    if (!SkillProcessor.judgeRoleHasSkill(role, skillName)) return ""; // 无此技能或技能无效
    const skill = SkillProcessor.getSkill(skillName);

    switch (skillName) {
      case ENUM.SKILL.FEMALE_DOCTOR_MIND_IMPLY_1:
      const { mindImply } = nightActionStore;
      return <div key={skillName} className="col-10"><div className="row align-items-center col-thin-gutters">
        <div className="col-3">
          <label>
            <input type="checkbox" className="spacing-inline-5" checked={mindImply.enabled}
                  onChange={e => nightActionStore.enableMindImply(e.target.checked)}
            />
            {skill.title}
          </label>
        </div>
        <div className="col-3">
          <DropdownList data={roleStore.roles} value={mindImply.role} valueField="name" textField="title" disabled={!mindImply.enabled}
                    onChange={value => nightActionStore.setMindImplyRole(value)} placeholder="对象"
          />
        </div>
        <div className="col-3">
          <DropdownList data={placeStore.places} value={mindImply.place} valueField="name" textField="title" disabled={!mindImply.enabled}
                    onChange={value => nightActionStore.setMindImplyPlace(value)} placeholder="地点"
          />
        </div>
      </div></div>;

    case ENUM.SKILL.MALE_DOCTOR_BRAIN_DIAGNOSIS:
      const { brainDiagnosis } = nightActionStore;
      return <div key={skillName} className="col-10"><div className="row align-items-center col-thin-gutters">
        <div className="col-3">
          <label>
            <input type="checkbox" className="spacing-inline-5" checked={brainDiagnosis.enabled === 1}
                   onChange={e => nightActionStore.enableBrainDiagnosis(e.target.checked ? 1 : 0)}
            />
            {skill.title}1
          </label>
        </div>
        <div className="col-3">
          <label>
            <input type="checkbox" className="spacing-inline-5" checked={brainDiagnosis.enabled === 2}
                   onChange={e => nightActionStore.enableBrainDiagnosis(e.target.checked ? 2 : 0)}
            />
            {skill.title}2
          </label>
        </div>
        <div className="col-3">
          <DropdownList data={roleStore.roles} value={brainDiagnosis.enabled ? brainDiagnosis.targets[0] : null}
                    valueField="name" textField="title" disabled={brainDiagnosis.enabled === 0}
                    onChange={value => nightActionStore.addBrainDiagnosisTarget(0, value)} placeholder="对象1"
          />
        </div>
        <div className="col-3">
          <DropdownList data={roleStore.roles} value={brainDiagnosis.enabled ? brainDiagnosis.targets[1] : null}
                    valueField="name" textField="title" disabled={brainDiagnosis.enabled !== 1}
                    onChange={value => nightActionStore.addBrainDiagnosisTarget(1, value)} placeholder="对象2"
          />
        </div>
      </div></div>;

    case ENUM.SKILL.FEMALE_TOURIST_INVITATION:
      const { invitation } = nightActionStore;
      return <div key={skillName} className="col-10"><div className="row align-items-center col-thin-gutters">
        <div className="col-3">
          <label>
            <input type="checkbox" className="spacing-inline-5" checked={invitation.enabled}
                   onChange={e => nightActionStore.enableInvitation(e.target.checked)}
            />
            {skill.title}
          </label>
        </div>
        <div className="col-3">
          <DropdownList data={roleStore.roles.filter(role => role.name !== ENUM.ROLE.FEMALE_TOURIST)} value={invitation.role} valueField="name" textField="title"
                    disabled={!invitation.enabled} onChange={value => nightActionStore.setInvitationRole(value)} placeholder="对象"
          />
        </div>
        <div className="col-3">
          <DropdownList data={placeStore.places} value={invitation.place} valueField="name" textField="title" disabled={!invitation.enabled}
                    onChange={value => nightActionStore.setInvitationPlace(value)} placeholder="地点"
          />
        </div>
      </div></div>;

    case ENUM.SKILL.GUIDE_SAFE_CHECK:
      const { safeCheck } = nightActionStore;
      return <div key={skillName} className="col-10"><div className="row align-items-center col-thin-gutters">
        <div className="col-3">
          <label>
            <input type="checkbox" className="spacing-inline-5" checked={safeCheck.enabled}
                   onChange={e => nightActionStore.enableSafeCheck(e.target.checked)}
            />
            {skill.title}
          </label>
        </div>
        <div className="col-3">
          <DropdownList data={placeStore.places} value={safeCheck.place} valueField="name" textField="title" disabled={!safeCheck.enabled}
                    onChange={value => nightActionStore.setSafeCheckPlace(value)} placeholder="地点"
          />
        </div>
      </div></div>;

    case ENUM.SKILL.PROPSMAN_SHOW_MECHANISM:
      const { mechanism } = nightActionStore;
      return <div key={skillName} className="col-5"><div className="row align-items-center col-thin-gutters">
        <div className="col-6">
          <label>
            <input type="checkbox" className="spacing-inline-5" checked={mechanism.enabled}
                   onChange={e => nightActionStore.enableMechanism(e.target.checked)}
            />
            {skill.title}
          </label>
        </div>
        <div className="col-6">
          <DropdownList data={placeStore.places} value={mechanism.place} valueField="name" textField="title" disabled={!mechanism.enabled}
                    onChange={value => nightActionStore.setMechanismPlace(value)} placeholder="地点"
          />
        </div>
      </div></div>;

    case ENUM.SKILL.PROPSMAN_SHOW_FRIGHTEN:
      const { frighten } = nightActionStore;
      const smallPlaces = placeStore.places.filter(place => place.capacity <= 2);
      return <div key={skillName} className="col-5"><div className="row align-items-center col-thin-gutters">
        <div className="col-6">
          <label>
            <input type="checkbox" className="spacing-inline-5" checked={frighten.enabled}
                   onChange={e => nightActionStore.enableFrighten(e.target.checked)}
            />
            {skill.title}
          </label>
        </div>
        <div className="col-6">
          <DropdownList data={smallPlaces} value={frighten.place} valueField="name" textField="title" disabled={!frighten.enabled}
                    onChange={value => nightActionStore.setFrightenPlace(value)} placeholder="地点"
          />
        </div>
      </div></div>;

    case ENUM.SKILL.PROPSMAN_SHOW_DOLL:
      return <div key={skillName} className="col-3 align-items-center thin-gutters">
        <label>
          <input type="checkbox"
                 className="spacing-inline-5"
                 checked={nightActionStore.useDoll}
                 onChange={() => { nightActionStore.useDoll = !nightActionStore.useDoll; }}
          />
          {skill.title}
        </label>
      </div>;

    case ENUM.SKILL.STUDENT_NIGHTMARE:
      const { nightmare } = nightActionStore;
      return <div key={skillName} className="col-10"><div className="row align-items-center col-thin-gutters">
        <div className="col-3">
          <label>
            <input type="checkbox" className="spacing-inline-5" checked={nightmare.enabled === 1}
                   onChange={e => nightActionStore.enableNightmare(e.target.checked ? 1 : 0)}
            />
            {skill.title}1
          </label>
        </div>
        <div className="col-3">
          <label>
            <input type="checkbox" className="spacing-inline-5" checked={nightmare.enabled === 2}
                   onChange={e => nightActionStore.enableNightmare(e.target.checked ? 2 : 0)}
            />
            {skill.title}2
          </label>
        </div>
        <div className="col-3">
          <DropdownList data={placeStore.places} value={nightmare.enabled ? nightmare.place : null}
                    valueField="name" textField="title" disabled={nightmare.enabled === 0}
                    onChange={value => nightActionStore.setNightmarePlace(value)} placeholder="地点"
          />
        </div>
      </div></div>;

    case ENUM.SKILL.CONJURATOR_WHITSUNDAYS:
      if (roleStore.deadRoles.length === 0) return "";
      return <div key={skillName} className="col-10"><div className="row align-items-center col-thin-gutters">
        <div className="col-4">
          <DropdownList
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
      </div></div>;

    case ENUM.SKILL.MANAGER_HOST_ADVANTAGE_2:
      if (role !== gameStore.killer) return "";
      return <div key={skillName} className="col-3 align-items-center thin-gutters">
        <label>
          <input type="checkbox"
                 className="spacing-inline-5"
                 checked={nightActionStore.hostAdvantage}
                 onChange={() => { nightActionStore.hostAdvantage = !nightActionStore.hostAdvantage; }}
          />
          {skill.title}
        </label>
      </div>;

    case ENUM.SKILL.PROGRAMMER_OVERTIME:
      const { overtime } = nightActionStore;
      if (gameStore.day - gameStore.overtimeUsed <= 1) return "";
      return <div key={skillName} className="col-10"><div className="row align-items-center col-thin-gutters">
        <div className="col-3">
          <label>
            <input type="checkbox" className="spacing-inline-5" checked={overtime.enabled}
                   onChange={e => nightActionStore.enableOvertime(e.target.checked)}
            />
            {skill.title}
          </label>
        </div>
        <div className="col-3">
          <DropdownList data={placeStore.places} value={overtime.place} valueField="name" textField="title" disabled={!overtime.enabled}
                    onChange={value => nightActionStore.setOvertimePlace(value)} placeholder="地点"
          />
        </div>
      </div></div>;

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
        {role.skills.map(skillName => this.renderSkill(skillName))}
      </div>
    );
  }
}

NightAction.propTypes = {
  role: PropTypes.object.isRequired
};

export default NightAction;
