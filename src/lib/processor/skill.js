import CLEWS from "../constants/clew";
import SKILLS from "../constants/skill";
import ENUM from "../constants/enum";
import Utils from "../utils";
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
    if (role.suspicious) return false; // 被刑侦，技能失效
    const skill = this.getSkill(skillName);
    if (role.suppressed && skill.type > 0) return false; // 被镇压，非锁定技失效
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
    perfumeTarget.extraClews.push(CLEWS.filter(clew => clew.name === "smell")[0]);
    gameStore.killer.location.extraClews.push(CLEWS.filter(clew => clew.name === "smell")[0]);
    logStore.addLog(`${nightActionStore.perfumeSource.title}<香水>在${perfumeTarget.title}和${gameStore.killer.location.title}产生了额外线索<痕迹：气味>`);
    nightActionStore.perfumeSource = null;
  },

  struggleToPlace: function(dst) {
    const title = nightActionStore.struggleSource.title;
    const src = placeStore.getBodyPlace(title);
    dst.bodies.push(title);
    dst.method = src.method;
    dst.clew = src.clew;
    dst.trickMethod = src.trickMethod;
    dst.trickClew = src.trickClew;
    src.bodies.remove(title);
    if (src.bodies.length === 0) {
      src.method = src.clew = src.trickMethod = src.trickClew = null;
    }
    logStore.addLog(`${title}<求生本能>把尸体从${src.title}转移到${dst.title}`);
    nightActionStore.struggleSource = null;
  },

  actMindImply: function(role) {
    const mi = nightActionStore.mindImply;
    if (mi.role && mi.place) {
      CommonProcessor.actNightMove(mi.role, mi.place, false);
      logStore.addLog(`${role.title}<心理暗示1>使${mi.role.title}向${mi.place.title}移动`);
    }
    nightActionStore.enableMindImply(false);
  },

  actBrainDiagnosis: function(role) {
    const bd = nightActionStore.brainDiagnosis;
    const targets = bd.targets.filter(t => t !== null);
    if (bd.enabled === 1 && targets.length > 0) {
      const feedback = [];
      targets.forEach(t => {
        feedback.push(t.title);
        feedback.push(t.fool ? "愚者" : "正常");
      })
      logStore.addLog(`${role.title}收到反馈："${feedback.join(" ")}"`, 2);
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
      CommonProcessor.actNightMove(invitation.role, invitation.place, false);
      CommonProcessor.actNightMove(role, invitation.place, false);
      logStore.addLog(`${role.title}<行动邀请>使${invitation.role.title}和${role.title}先后向${invitation.place.title}移动`);
    }
    nightActionStore.enableMindImply(false);
  },

  actSafeCheck: function(role) {
    const place = nightActionStore.safeCheck.place;
    if (place) {
      const roleTitles = place.roles.map(role => role.title).join(" ");
      logStore.addLog(`${role.title}<安全检查>${place.title}，收到反馈："${roleTitles}"`, 2);
    }
  },

  actWhitsundays: function(role) {
    const target = nightActionStore.whitsundays.role;
    if (target !== null) {
      role.methods_ = role.methods;
      role.clews_ = role.clews;
      role.skills_ = role.skills;
      role.usedLimitedSkills_ = role.usedLimitedSkills;

      role.methods = target.methods;
      role.clews = target.clews;
      role.skills = target.skills;
      role.usedLimitedSkills = target.usedLimitedSkills;

      role.keen = target.keen;
      role.inference = target.inference;
      role.fierce = target.fierce;

      nightActionStore.whitsundays.used = true;
      logStore.addLog(`灵媒<降灵>了${target.title}`);
    }
  },

  checkWhitsundays: function(roleNames, name) {
    if (nightActionStore.whitsundays.used && nightActionStore.whitsundays.role.name === name) {
      return roleNames.indexOf(ENUM.ROLE.CONJURATOR);
    }
    return -1;
  },

  recoverWhitsundays: function() {
    const role = roleStore.getRole(ENUM.ROLE.CONJURATOR);
    if (!role) return;
    role.methods = role.methods_;
    role.clews = role.clews_;
    role.skills = role.skills_;
    role.usedLimitedSkills = role.usedLimitedSkills_;
    role.keen = role.inference = role.fierce = 0;
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
    roles.forEach(role => CommonProcessor.actNightMove(role, defaultPlace, false));
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
        logStore.addLog(`${role.title}<旧日梦魇1>查看了${place.title}，收到反馈："次日白天将拥有[敏锐]属性"`, 2);
    } else {
      nightActionStore.nightmare.resultPlace = place;
      logStore.addLog(`${role.title}<旧日梦魇2>选择了${place.title}，效果将于次日白天生效`);
    }
  },

  actCrimeGeinus: function(role, extraClew, place) {
    if (extraClew === null || place === null) return;
    place.extraClews.push(extraClew);
    logStore.addLog(`${role.title}<犯罪天才2>在${place.title}留下了额外线索<${extraClew.title}>`);
  },

  addFlowingExtraClews: function(flowingTarget) {
    flowingTarget.extraClews.push(CLEWS.filter(clew => clew.name === "water")[0]);
    gameStore.killer.location.extraClews.push(CLEWS.filter(clew => clew.name === "water")[0]);
    logStore.addLog(`卫生间<流水2>使${flowingTarget.title}和${gameStore.killer.location.title}产生了额外线索<痕迹：水迹>`);
    nightActionStore.flowingActive = false;
  },

  actOvertime: function(role) {
    const place = role.location;
    const roleTitles = place.roles.map(role => role.title).join(" ");
    logStore.addLog(`${role.title}在${place.title}<加班>，收到反馈："${roleTitles}"`, 2);
    gameStore.overtimeUsed = gameStore.day; 
  },

  actSkillsBeforeKilling: function() {
    if (nightActionStore.acting !== 0) return;
    nightActionStore.acting = 1;
    const roles = roleStore.roles.slice();
    const roleNames = roles.map(r => r.name);
    let index = -1, role = null;

    if ((index = roleNames.indexOf(ENUM.ROLE.STUDENT)) >= 0 || (index = this.checkWhitsundays(roleNames, ENUM.ROLE.STUDENT)) >= 0) {
      role = roles[index];
      this.actNightmare(role, nightActionStore.nightmare.enabled, nightActionStore.nightmare.place);
    }
    
    if ((index = roleNames.indexOf(ENUM.ROLE.MALE_DOCTOR)) >= 0 || (index = this.checkWhitsundays(roleNames, ENUM.ROLE.MALE_DOCTOR)) >= 0) {
      role = roles[index];
      if (nightActionStore.brainDiagnosis.enabled > 0) {
        if (this.judgeRoleHasSkill(role, ENUM.SKILL.MALE_DOCTOR_BRAIN_DIAGNOSIS)) this.actBrainDiagnosis(role);
        role.usedLimitedSkills.push(ENUM.SKILL.MALE_DOCTOR_BRAIN_DIAGNOSIS);
      }
    }

    if ((index = roleNames.indexOf(ENUM.ROLE.PROPSMAN)) >= 0 || (index = this.checkWhitsundays(roleNames, ENUM.ROLE.PROPSMAN)) >= 0) {
      role = roles[index];
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

    if ((index = roleNames.indexOf(ENUM.ROLE.FEMALE_DOCTOR)) >= 0 || (index = this.checkWhitsundays(roleNames, ENUM.ROLE.FEMALE_DOCTOR)) >= 0) {
      role = roles[index];
      if (nightActionStore.mindImply.enabled) {
        if (this.judgeRoleHasSkill(role, ENUM.SKILL.FEMALE_DOCTOR_MIND_IMPLY_1)) this.actMindImply(role);
        role.usedLimitedSkills.push(ENUM.SKILL.FEMALE_DOCTOR_MIND_IMPLY_1);
      }
    }

    if ((index = roleNames.indexOf(ENUM.ROLE.FEMALE_TOURIST)) >= 0 || (index = this.checkWhitsundays(roleNames, ENUM.ROLE.FEMALE_TOURIST)) >= 0) {
      role = roles[index];
      if (nightActionStore.invitation.enabled) {
        if (this.judgeRoleHasSkill(role, ENUM.SKILL.FEMALE_TOURIST_INVITATION)) this.actInvitation(role);
        role.usedLimitedSkills.push(ENUM.SKILL.FEMALE_TOURIST_INVITATION);
      }
    }

    if ((index = roleNames.indexOf(ENUM.ROLE.GUIDE)) >= 0 || (index = this.checkWhitsundays(roleNames, ENUM.ROLE.GUIDE)) >= 0) {
      role = roles[index];
      if (nightActionStore.safeCheck.enabled) {
        if (this.judgeRoleHasSkill(role, ENUM.SKILL.GUIDE_SAFE_CHECK)) this.actSafeCheck(role);
        if (gameStore.killer.name !== role.name) role.usedLimitedSkills.push(ENUM.SKILL.GUIDE_SAFE_CHECK);
      }
    }

    if ((index = roleNames.indexOf(ENUM.ROLE.PROGRAMMER)) >= 0 || (index = this.checkWhitsundays(roleNames, ENUM.ROLE.PROGRAMMER)) >= 0) {
      role = roles[index];
      if (nightActionStore.overtime) {
        if (this.judgeRoleHasSkill(role, ENUM.SKILL.PROGRAMMER_OVERTIME)) this.actOvertime(role);
      }
    }
  },

  actSkillsAfterKilling: function() {
    if (nightActionStore.acting !== 1) return;
    nightActionStore.acting = 2;
    /*const roles = roleStore.roles.slice();
    const roleNames = roles.map(r => r.name);
    let index = -1, role = null;*/
  },

  actExploration: function(role) {
    const place = dayActionStore.exploration;
    if (place != null) {
      logStore.addLog(`${role.title}<探险精神>向${place.title}移动`);
      CommonProcessor.actDayMove(role, place, false);
    }
    role.usedLimitedSkills.push(ENUM.SKILL.FEMALE_TOURIST_EXPLORATION);
  },

  actMeticulous: function(role) {
    dayActionStore.usedMeticulous = true;
    const place = role.location;
    const extraClews = placeStore.getVisibleExtraClews(place);
    if (extraClews.length > 0) {
      logStore.addLog(`${role.title}<缜密心思>收到反馈："${extraClews.map(c => c.title).join(" ")}"`, 2);
      placeStore.clearExtraClewsOfPlace(place, extraClews);
    }
  },

  actInspiration: function(role) {
    const selected = dayActionStore.inspiration.selected.key;
    if (selected !== null) {
      const target = roleStore.getRole(selected.name);
      const usedType = selected.type;
      dayActionStore.inspiration[usedType] = true;
      if (usedType === "usedKeen" && target.keen === 0) {
        target.keen = 1;
        dayActionStore.inspiration.keenUntilNight = target;
        logStore.addLog(`${role.title}<鞭策1>使${target.title}在天黑前获得[敏锐]属性`);
      }
      if (usedType === "usedMove") {
        if (target.movement >= 0) target.movement++;
        logStore.addLog(`${role.title}<鞭策2>使${target.title}当日白天剩余移动次数+1`);
      }
    }
  },
  
  actPerfectMemory: function(role) {
    dayActionStore.perfectMemory.used = true;
    const place = dayActionStore.perfectMemory.place;
    if (place !== null) {
      const extraTraceClews = placeStore.getVisibleExtraClews(place).filter(c => c.type === 0);
      if (extraTraceClews.length > 0) {
        logStore.addLog(`${role.title}<完美记忆>收到反馈："${extraTraceClews.map(c => c.title).join(" ")}"`, 2);
      }
    }
  },

  actSuppress: function(role) {
    const place = dayActionStore.suppress;
    if (place !== null && place.roles.length > 0) {
      place.roles.forEach(r => {
        r.movement = -1;
        r.suppressed = true;
      });
      logStore.addLog(`${role.title}<镇压>了${place.title}，当日${place.roles.map(r => r.title).join("、")}禁止移动、非锁定技和投票无效。`)
    }
    role.usedLimitedSkills.push(ENUM.SKILL.SOLDIER_SUPPRESS);
  },

  actSuspicion: function(role) {
    dayActionStore.suspicion.used = true;
    const target = dayActionStore.suspicion.target;
    if (target !== null) {
      roleStore.roles.forEach(role => role.suspicious = false);
      target.suspicious = true;
      logStore.addLog(`导演公告："${role.title}使用了<刑侦>！"`, 2);
    }
  },

  actGuard: function(role) {
    roleStore.roles.forEach(role => {
      if (!this.judgeRoleHasSkill(role, ENUM.SKILL.HIGH_SCHOOL_STUDENT_DEXTEROUS)) { // 高中生<灵巧>无视<警戒>
        role.movement = -1;
      }
    });
    logStore.addLog(`${role.title}发动了<警戒>，要求公告所有玩家位置，当日禁止移动。`, 2);
    role.keen = 0;
    role.inference = 1;
    role.usedLimitedSkills.push(ENUM.SKILL.POLICE_WOMAN_GUARD);
  },

  actMediumship: function(role) {
    const target = dayActionStore.mediumship;
    if (target !== null) {
      logStore.addLog(`${role.title}<通灵>，请${target.title}遗言`);
    }
    role.usedLimitedSkills.push(ENUM.SKILL.CONJURATOR_MEDIUMSHIP);
  },

  actToyCar: function(role) {
    const place = dayActionStore.toyCarPlace;
    if (place !== null) {
      let feedbacks = role.fool ^ dayActionStore.trickReversed
        ? CommonProcessor.getFoolFeedback(place, role)
        : CommonProcessor.getNormalFeedback(place, role);
      if (feedbacks[1]) feedbacks[0].push(feedbacks[1].title);
      if (feedbacks[2]) feedbacks[0].push(feedbacks[2].title);
      feedbacks = feedbacks[0];
      feedbacks = Utils.uniqueArray(feedbacks);
      if (feedbacks.length > 0) {
        logStore.addLog(`${role.title}<玩具巡逻车>收到反馈："${feedbacks.join(" ")}"`, 2);
      }
    }
    role.usedLimitedSkills.push(ENUM.SKILL.PROPSMAN_SHOW_TOY_CAR);
  },

  actExpert: function(role) {
    placeStore.clearAllExtraClews();
    logStore.addLog(`${role.title}<轻车熟路1>清除了所有额外线索`);
  }
};

export default SkillProcessor;
