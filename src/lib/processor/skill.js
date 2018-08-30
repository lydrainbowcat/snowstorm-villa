import CLEWS from "../constants/clew";
import SKILLS from "../constants/skill";
import ENUM from "../constants/enum";
import gameStore from "../store/game_store";
import logStore from "../store/log_store";
import roleStore from "../store/role_store";
import placeStore from "../store/place_store";
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

  actSafeCheck: function(role) {
    const place = nightActionStore.safeCheck.place;
    if (place) {
      const roleTitles = place.roles.map(role => role.title).join(" ");
      logStore.addLog(`导游<安全检查>${place.title}，收到反馈："${roleTitles}"`);
    }
  },

  selectPropsForShow: function(mechanism, toyCar, frighten, doll) {
    const result = [];
    const role = roleStore.getRole(ENUM.ROLE.PROPSMAN);
    if (mechanism) result.push("机关锁"); else role.usedLimitedSkills.push(ENUM.SKILL.PROPSMAN_SHOW_MECHANISM);
    if (toyCar) result.push("玩具巡逻车"); else role.usedLimitedSkills.push(ENUM.SKILL.PROPSMAN_SHOW_TOY_CAR);
    if (frighten) result.push("惊吓盒"); else role.usedLimitedSkills.push(ENUM.SKILL.PROPSMAN_SHOW_FRIGHTEN);
    if (doll) result.push("人偶"); else role.usedLimitedSkills.push(ENUM.SKILL.PROPSMAN_SHOW_DOLL);
    logStore.addLog(`道具师<演出准备>选择了道具：${result.join("，")}`);
  },

  actMechanism: function(role, place) {
    place.locked = true;
    logStore.addLog(`${role.title}在${place.title}使用了<机关锁>`);
  },

  actFrighten: function(role, place) {
    const roles = place.roles.slice();
    const defaultPlace = placeStore.getPlace(ENUM.PLACE.LIVING_ROOM);
    roles.forEach(role => CommonProcessor.actNightMove(role, defaultPlace));
    const titles = roles.map(role => role.title);
    logStore.addLog(`${role.title}在${place.title}使用了<惊吓盒>，使${titles.join("、")}向${defaultPlace.title}移动`);
  },

  actDoll: function(role) {
    nightActionStore.killerTrack = true;
    logStore.addLog(`${role.title}使用了<人偶>`);
  },

  actNightmare: function(role, type, place) {
    if (type === 0 || place === null) {
      nightActionStore.nightmare.hasKeen = false;
      nightActionStore.nightmare.resultPlace = null;
      return;
    }
    if (type === 1) {
      nightActionStore.nightmare.hasKeen = place.roles.reduce((result, role) => result || role.keen > 0, false);
      if (nightActionStore.nightmare.hasKeen)
        logStore.addLog(`${role.title}<旧日梦魇1>查看了${place.title}，得到反馈："次日白天将拥有[敏锐]属性"`);
    } else {
      nightActionStore.nightmare.resultPlace = place;
      logStore.addLog(`${role.title}<旧日梦魇2>选择了${place.title}，效果将于次日白天生效`);
    }
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
      role = roles[index];
      this.actNightmare(role, nightActionStore.nightmare.enabled, nightActionStore.nightmare.place);
    }
    
    if ((index = roleNames.indexOf(ENUM.ROLE.MALE_DOCTOR)) >= 0) {
      role = roles[index];
      if (nightActionStore.brainDiagnosis.enabled > 0) {
        if (this.judgeRoleHasSkill(role, ENUM.SKILL.MALE_DOCTOR_BRAIN_DIAGNOSIS)) this.actBrainDiagnosis();
        role.usedLimitedSkills.push(ENUM.SKILL.MALE_DOCTOR_BRAIN_DIAGNOSIS);
      }
    }

    if ((index = roleNames.indexOf(ENUM.ROLE.PROPSMAN)) >= 0) {
      role = roles[index];
      if (this.judgeRoleHasSkill(role, ENUM.SKILL.PROPSMAN_PROPSBOX)) {
        nightActionStore.setTrickClew(nightActionStore.clew);
        nightActionStore.setTrickMethod(nightActionStore.method);
      }
      if (nightActionStore.mechanism.enabled) {
        if (this.judgeRoleHasSkill(role, ENUM.SKILL.PROPSMAN_SHOW_MECHANISM))
          this.actMechanism(role, nightActionStore.mechanism.place);
        role.usedLimitedSkills.push(ENUM.SKILL.PROPSMAN_SHOW_MECHANISM);
      }
      if (nightActionStore.frighten.enabled) {
        if (this.judgeRoleHasSkill(role, ENUM.SKILL.PROPSMAN_SHOW_FRIGHTEN))
          this.actFrighten(role, nightActionStore.frighten.place);
        role.usedLimitedSkills.push(ENUM.SKILL.PROPSMAN_SHOW_FRIGHTEN);
      }
      if (nightActionStore.useDoll) {
        if (this.judgeRoleHasSkill(role, ENUM.SKILL.PROPSMAN_SHOW_DOLL)) this.actDoll(role);
        role.usedLimitedSkills.push(ENUM.SKILL.PROPSMAN_SHOW_DOLL);
      }
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
      role = roles[index];
      if (nightActionStore.safeCheck.enabled) {
        if (this.judgeRoleHasSkill(role, ENUM.SKILL.GUIDE_SAFE_CHECK)) this.actSafeCheck(role);
        if (gameStore.killer.name !== role.name) role.usedLimitedSkills.push(ENUM.SKILL.GUIDE_SAFE_CHECK);
      }
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

  actExploration: function(role) {
    const place = dayActionStore.exploration;
    if (place != null) {
      CommonProcessor.actDayMove(role, place, false);
      logStore.addLog(`${role.title}<探险精神>向${place.title}移动`);
    }
    role.usedLimitedSkills.push(ENUM.SKILL.FEMALE_TOURIST_EXPLORATION);
  },

  actMeticulous: function(role) {
    dayActionStore.usedMeticulous = true;
    const place = role.location;
    if (place.extraClews.length > 0) {
      logStore.addLog(`${role.title}<缜密心思>收到反馈："${place.extraClews.join(" ")}"`);
      place.extraClews.clear();
    }
  },

  actInspiration: function(role, type) {
    dayActionStore.inspiration.used[type] = true;
    const target = dayActionStore.inspiration.selected;
    if (target !== null) {
      if (type === 0 && target.keen === 0) {
        target.keen = 1;
        dayActionStore.inspiration.keenUntilNight = target;
        logStore.addLog(`${role.title}<鞭策1>使${target.title}在天黑前获得[敏锐]属性`);
      }
      if (type === 1) {
        target.movement++;
        logStore.addLog(`${role.title}<鞭策2>使${target.title}当日白天剩余移动次数+1`);
      }
    }
  },
  
  actPerfectMemory: function(role) {
    dayActionStore.perfectMemory.used = true;
    const place = dayActionStore.perfectMemory.place;
    const traceClews = CLEWS.filter(clew => clew.type === 0).map(clew => clew.title);
    const extraTraceClews = place.extraClews.filter(title => traceClews.indexOf(title) !== -1);
    if (place !== null && extraTraceClews.length > 0) {
      logStore.addLog(`${role.title}<完美记忆>收到反馈："${extraTraceClews.join(" ")}"`);
    }
  },

  actToyCar: function(role) {
    const place = dayActionStore.toyCarPlace;
    if (place !== null && place.bodies.length > 0) {
      const feedbacks = role.fool ^ dayActionStore.trickReversed
        ? CommonProcessor.getFoolFeedback(place)
        : CommonProcessor.getNormalFeedback(place);
      logStore.addLog(`${role.title}<玩具巡逻车>收到反馈："${feedbacks.join(" ")}"`);
    }
    role.usedLimitedSkills.push(ENUM.SKILL.PROPSMAN_SHOW_TOY_CAR);
  }
};

export default SkillProcessor;
