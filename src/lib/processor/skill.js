import CLEWS from "../constants/clew";
import SKILLS from "../constants/skill";
import ENUM from "../constants/enum";
import gameStore from "../store/game_store";
import logStore from "../store/log_store";
import roleStore from "../store/role_store";
import nightActionStore from "../store/night_action_store";
import dayActionStore from "../store/day_action_store";
import CommonProcessor from "./common";

const SkillProcessor = {
  getSkill: function(skillName) {
    const result = SKILLS.filter(s => s.name === skillName);
    return result.length > 0 ? result[0] : null;
  },

  judgeRoleHasSkill: function(role, skillName) {
    if (role.skills.indexOf(skillName) < 0) return false; // 无此技能
    const skill = this.getSkill(skillName);
    if (skill.type === 2 && role.usedLimitedSkills.indexOf(skillName) >= 0) return false; // 已用过的限定技
    return true;
  },

  addCriminalInvestFeedback: function(role, feedbacks) {
    if (this.judgeRoleHasSkill(role, ENUM.SKILL.FORENSIC_DOCTOR_CRIMINAL_INVEST)) {
      role.usedLimitedSkills.push(ENUM.SKILL.FORENSIC_DOCTOR_CRIMINAL_INVEST);
      const motivationStr = gameStore.motivations.map(m => `<${m.title}>`).join("");
      feedbacks.push(`动机${motivationStr}`);
    }
  },

  addPerfumeExtraClew: function(perfumeTarget) {
    perfumeTarget.extraClews.push(CLEWS.filter(clew => clew.name === "smell")[0].title);
    gameStore.killer.location.extraClews.push(CLEWS.filter(clew => clew.name === "smell")[0].title);
    logStore.addLog(`女医生<香水>在${perfumeTarget.title}和${gameStore.killer.location.title}产生了额外线索<痕迹：气味>`);
    nightActionStore.perfumeActive = false;
  },

  struggleToPlace: function(dst) {
    const src = nightActionStore.struggleFrom;
    dst.bodies.push("猎人");
    dst.method = src.method;
    dst.clew = src.clew;
    dst.trickMethod = src.trickMethod;
    dst.trickClew = src.trickClew;
    src.bodies.remove("猎人");
    if (src.bodies.length === 0) {
      src.method = src.clew = src.trickMethod = src.trickClew = null;
    }
    logStore.addLog(`猎人<求生本能>把尸体从${src.title}转移到${dst.title}`);
    nightActionStore.struggleFrom = null;
  },

  actMindImply: function() {
    const mi = nightActionStore.mindImply;
    if (mi.role && mi.place) {
      CommonProcessor.actNightMove(mi.role, mi.place);
      logStore.addLog(`女医生<心理暗示1>使${mi.role.title}向${mi.place.title}移动`);
    }
    nightActionStore.enableMindImply(false);
  },

  actBrainDiagnosis: function() {
    const bd = nightActionStore.brainDiagnosis;
    const targets = bd.targets.filter(t => t !== null);
    if (bd.enabled === 1 && targets.length > 0) {
      const feedback = [];
      targets.forEach(t => {
        feedback.push(t.title);
        feedback.push(t.fool ? "愚者" : "正常");
      })
      logStore.addLog(`男医生收到反馈："${feedback.join(" ")}"`);
    }
    if (bd.enabled === 2 && targets.length > 0) {
      const t = targets[0];
      if (gameStore.killer !== t) {
        if (t.fool) {
          t.fool = false;
          logStore.addLog(`<思维诊疗>使${t.title}失去了愚者身份`);
        } else {
          t.fool = true;
          logStore.addLog(`<思维诊疗>使${t.title}获得了愚者身份`);
        }
      }
    }
    nightActionStore.enableBrainDiagnosis(0);
  },

  actInvitation: function(role) {
    const invitation = nightActionStore.invitation;
    if (invitation.role && invitation.place) {
      CommonProcessor.actNightMove(invitation.role, invitation.place);
      CommonProcessor.actNightMove(role, invitation.place);
      logStore.addLog(`女驴友<行动邀请>使${invitation.role.title}和女驴友先后向${invitation.place.title}移动`);
    }
    nightActionStore.enableMindImply(false);
  },

  actSkillsBeforeKilling: function() {
    if (nightActionStore.acting !== 0) return;
    nightActionStore.acting = 1;
    const roles = roleStore.roles.slice();
    const roleNames = roles.map(r => r.name);
    let index = -1, role = null;

    if ((index = roleNames.indexOf(ENUM.ROLE.CONJURATOR)) >= 0) {
    }

    if ((index = roleNames.indexOf(ENUM.ROLE.STUDENT)) >= 0) {
    }
    
    if ((index = roleNames.indexOf(ENUM.ROLE.MALE_DOCTOR)) >= 0) {
      role = roles[index];
      if (nightActionStore.brainDiagnosis.enabled > 0) {
        if (this.judgeRoleHasSkill(role, ENUM.SKILL.MALE_DOCTOR_BRAIN_DIAGNOSIS)) this.actBrainDiagnosis();
        role.usedLimitedSkills.push(ENUM.SKILL.MALE_DOCTOR_BRAIN_DIAGNOSIS);
      }
    }

    if ((index = roleNames.indexOf(ENUM.ROLE.PROPSMAN)) >= 0) {
    }

    if ((index = roleNames.indexOf(ENUM.ROLE.FEMALE_DOCTOR)) >= 0) {
      role = roles[index];
      if (nightActionStore.mindImply.enabled) {
        if (this.judgeRoleHasSkill(role, ENUM.SKILL.FEMALE_DOCTOR_MIND_IMPLY_1)) this.actMindImply();
        role.usedLimitedSkills.push(ENUM.SKILL.FEMALE_DOCTOR_MIND_IMPLY_1);
      }
    }

    if ((index = roleNames.indexOf(ENUM.ROLE.FEMALE_TOURIST)) >= 0) {
      role = roles[index];
      if (nightActionStore.invitation.enabled) {
        if (this.judgeRoleHasSkill(role, ENUM.SKILL.FEMALE_TOURIST_INVITATION)) this.actInvitation(role);
        role.usedLimitedSkills.push(ENUM.SKILL.FEMALE_TOURIST_INVITATION);
      }
    }

    if ((index = roleNames.indexOf(ENUM.ROLE.GUIDE)) >= 0) {
    }
  },

  actSkillsAfterKilling: function() {
    if (nightActionStore.acting !== 1) return;
    nightActionStore.acting = 2;
    /*const roles = roleStore.roles.slice();
    const roleNames = roles.map(r => r.name);
    let index = -1, role = null;

    if ((index = roleNames.indexOf(ENUM.ROLE.DETECTIVE)) >= 0) {
      role = roles[index];
      // TODO
    }*/
  },

  actExploration(role) {
    const place = dayActionStore.exploration;
    if (place != null) {
      CommonProcessor.actDayMove(role, place, false);
      logStore.addLog(`女驴友<探险精神>向${place.title}移动`);
    }
    role.usedLimitedSkills.push(ENUM.SKILL.FEMALE_TOURIST_EXPLORATION);
  },

  actMeticulous(role) {
    const place = role.location;
    if (place.extraClews.length > 0) {
      logStore.addLog(`${role.title}<缜密心思>收到反馈："${place.extraClews.join(" ")}"`);
      place.extraClews.clear();
    }
    dayActionStore.usedMeticulous = true;
  }
};

export default SkillProcessor;
