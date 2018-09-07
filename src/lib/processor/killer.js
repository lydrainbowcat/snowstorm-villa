import CLEWS from "../constants/clew";
import METHODS from "../constants/method";
import ENUM from "../constants/enum";
import Utils from "../utils";

import MOTIVATIONS from "../constants/motivation";
import gameStore from "../store/game_store";
import roleStore from "../store/role_store";
import placeStore from "../store/place_store";
import nightActionStore from "../store/night_action_store";
import dayActionStore from "../store/day_action_store";
import CommonProcessor from "./common";
import SkillProcessor from "./skill";

const KillerProcessor = {
  addMotivation: function(motivation, type, detail) {
    gameStore.addMotivation(motivation);
    let log = `凶手选择了动机<${gameStore.motivations[0].title}>`;
    if (motivation === "premeditation") {
      log += `，预谋${type === "method" ? "手法" : "线索"}为<${detail.title}>`;
      // 把预谋手法或线索加入凶手人物模板
      if (type === "method") gameStore.killer.methods.push(detail.name);
      else gameStore.killer.clews.push(detail.name);
    }
    return log;
  },

  addAllMotivations: function(type, detail) {
    let log = "凶手<刑事侦查>可使用所有犯罪动机。";
    if (detail != null) {
      log += this.addMotivation("premeditation", type, detail);
    }
    MOTIVATIONS.filter(m => m.name !== "premeditation").forEach(m => this.addMotivation(m.name, type, detail));
    return log;
  },

  getAvailableMethods: function() {
    // 在厨房可能得允许拿刀/允许溺水卫生间，这里允许所有手法，可行不可行留作判定
    return METHODS.filter(method => method.name !== gameStore.lastMethodName);
  },

  getAvailableClews: function() {
    const killer = gameStore.killer;
    const clews = CLEWS.filter(clew =>
      killer.clews.indexOf(clew.name) !== -1 && gameStore.usedClewsName.indexOf(clew.name) === -1
    );
    if (SkillProcessor.judgeRoleHasSkill(killer, ENUM.SKILL.PROPSMAN_SHOW_DOLL)) {
      clews.push({name: "", title: "空", type: 2});
    }
    return clews;
  },

  getAvailableMethodsByRole: function(role) {
    return METHODS.filter(method => role.methods.indexOf(method.name) !== -1);
  },

  getAvailableClewsByRole: function(role) {
    return CLEWS.filter(clew => role.clews.indexOf(clew.name) !== -1);
  },

  validateKilling: function() {
    const {targetType, targetRole, targetPlace, method, clew, trickMethod, trickClew, implyMethod, implyClew} = nightActionStore;
    const killer = gameStore.killer;
    const killerLocation = killer.location;

    if (targetType === "role" && targetRole === null) return "未设定谋杀死者";
    if (targetType === "place" && targetPlace === null) return "未设定群杀地点";
    if (method === null) return "未设定杀人手法";
    if (clew === null) return "未设定遗留线索";
    if (trickMethod === null) return "未设定诡计手法";
    if (trickClew === null) return "未设定诡计线索";

    // 地点特性
    if (targetType === "place" && targetPlace.name === ENUM.PLACE.GARDEN && method.name !== "trap" &&
        !SkillProcessor.judgeRoleHasSkill(killer, ENUM.SKILL.MANAGER_HOST_ADVANTAGE_1))
      return "不能以非陷阱方式群杀花园";
    if (method.name === "drown" && (targetType !== "place" || targetPlace.name !== ENUM.PLACE.TOILET))
      return "不能溺水杀卫生间以外的地方";
    if (method.name !== "drown" && killer.methods.indexOf(method.name) === -1 &&
        !((method.name === "blade" || method.name === "strangle") && killerLocation.name === ENUM.PLACE.KITCHEN))
      return "人物模版没有选定的杀人手法";

    // 人物技能
    if (targetType === "role" && SkillProcessor.judgeRoleHasSkill(targetRole, ENUM.SKILL.HUNTER_STRUGGLE))
      return "<求生本能.锁定>：不能指杀猎人";
    if (targetType === "role" && SkillProcessor.judgeRoleHasSkill(targetRole, ENUM.SKILL.DETECTIVE_LEAD_ADVANTAGE))
      return "<主角光环.锁定>：不能指杀侦探";
    if (SkillProcessor.judgeRoleHasSkill(killer, ENUM.SKILL.FEMALE_DOCTOR_MIND_IMPLY_2) && targetType === "role" && method.name === "poison") {
      if (implyMethod === null) return "未设定<心理暗示2>手法";
      if (implyClew === null) return "未设定<心理暗示2>线索";
    }

    return null;
  },

  checkTargetRoleKilling: function(killer, targetRole) {
    if (SkillProcessor.judgeRoleHasSkill(killer, ENUM.SKILL.MISTERIOUS_MAN_EXPERT_1)) return true; // 神秘人<轻车熟路1>点杀必定成功
    if (targetRole.location.capacity <= 3 && SkillProcessor.judgeRoleHasSkill(targetRole, ENUM.SKILL.STUDENT_USELESS)) return false; // 学生<无用学识>，不会在人数上限<=3的地方被点杀
    if (SkillProcessor.judgeRoleHasSkill(killer, ENUM.SKILL.MANAGER_HOST_ADVANTAGE_1)) return true; // 管理员<主场优势1>点杀无视地形保护
    if (targetRole.location.name === ENUM.PLACE.CELLAR) return false; // 地下室的人无法被点杀
    return true;
  },

  checkTargetPlaceKilling: function(killer, targetPlace) {
    if (targetPlace.roles.filter(r => SkillProcessor.judgeRoleHasSkill(r, ENUM.SKILL.SOLDIER_PROTECTION)).length > 0 &&
        nightActionStore.method !== "poison" && nightActionStore.method !== "trap") return false; // 军人<保护>，毒杀和陷阱以外的手法无效
    return true;
  },

  actKilling: function() {
    const {targetType, targetRole, targetPlace, trickMethod, trickClew} = nightActionStore;
    let {method, clew} = nightActionStore;
    const killer = gameStore.killer;
    const killerLocation = killer.location;

    gameStore.lastMethodName = method.name;
    if (clew.name !== "") gameStore.usedClewsName.push(clew.name);

    // 执行杀人判定
    let deadLocation = null;
    let logText = killer.title;
    let deadList = [];
    let escaped = false;

    if (targetType === "role") {
      logText += `<点杀>${targetRole.title}，`;
      deadLocation = targetRole.location;
      if (this.checkTargetRoleKilling(killer, targetRole)) { // 点杀成功
        roleStore.killRole(targetRole);
        deadList.push(targetRole);
        if (SkillProcessor.judgeRoleHasSkill(killer, ENUM.SKILL.FEMALE_DOCTOR_MIND_IMPLY_2) && method.name === "poison") { // 女医生<心理暗示2>生效，替换手法与线索
          method = nightActionStore.implyMethod;
          clew = nightActionStore.implyClew;
        }
      }
    } else {
      logText += `<群杀>${targetPlace.title}，`;
      deadLocation = targetPlace;
      if (this.checkTargetPlaceKilling(killer, targetPlace)) { // 群杀成功
        targetPlace.roles.slice().forEach(role => { // 复制一份避免killRole影响循环
          if (targetPlace.name !== ENUM.PLACE.LIVING_ROOM && SkillProcessor.judgeRoleHasSkill(role, ENUM.SKILL.MANAGER_ESCAPE)) { // 管理员<逃命>
            CommonProcessor.actNightMove(role, placeStore.getPlace(ENUM.PLACE.LIVING_ROOM));
            escaped = true;
          } else { // 被杀
            roleStore.killRole(role);
            deadList.push(role);
          }
        });
        Utils.shuffleArray(deadLocation.bodies);
      }
    }

    logText += `线索为<${method.title}><${clew.title}>，诡计为<${trickMethod.title}><${trickClew.title}>，`;
    if (deadList.length > 0) {
      logText += "死者有：" + deadList.map(r => r.title).join("，") + "。";
      deadLocation.method = method;
      deadLocation.clew = clew.name === "" ? null : clew;
      deadLocation.trickMethod = trickMethod;
      deadLocation.trickClew = trickClew.name === "" ? null : trickClew;
      nightActionStore.setCanJoviality(true);
      gameStore.someoneKilled = true;
      if (SkillProcessor.judgeRoleHasSkill(killer, ENUM.SKILL.MALE_TOURIST_SPECIAL_TRAP) && targetType === "role" && method.name === "trap") { // 男驴友<特制陷阱>生效
        dayActionStore.trickReversed = true;
      }
    } else {
      logText += `行凶失败。`;
      // 当线索为空，或者除管理员以外的凶手因管理员<逃命>而谋杀失败时，不留额外线索
      if (clew.name !== "" || (escaped && killer.name !== ENUM.ROLE.MANAGER)) deadLocation.extraClews.push(clew.title);
      nightActionStore.setCanJoviality(false);

      // 凶手行踪已激活时，若凶手行凶失败、未在花园过夜且过夜地点有受困者存活，提醒凶手行踪
      nightActionStore.killerTrack |= gameStore.killerTrackActive &&
        killerLocation.name !== ENUM.PLACE.GARDEN && killerLocation.roles.length > 1;
    }
    
    deadList.forEach(role => {
      if (SkillProcessor.judgeRoleHasSkill(role, ENUM.SKILL.FEMALE_DOCTOR_PERFUME)) { // 女医生<香水>技能生效，要求凶手留下额外线索<气味>
        nightActionStore.perfumeActive = true;
      }
      if (SkillProcessor.judgeRoleHasSkill(role, ENUM.SKILL.HUNTER_STRUGGLE)) { // 猎人<求生本能>技能生效，要求猎人转移尸体
        nightActionStore.struggleFrom = deadLocation;
      }
    });

    if (killerLocation.name === ENUM.PLACE.KITCHEN) { // 凶手在厨房过夜，案发地会留下零食
      deadLocation.extraClews.push(CLEWS.filter(clew => clew.name === "snack")[0].title);
    }
    if (killerLocation.name === ENUM.PLACE.GARDEN) { // 凶手在花园过夜，案发地会留下泥土
      deadLocation.extraClews.push(CLEWS.filter(clew => clew.name === "soil")[0].title);
    }

    if (SkillProcessor.judgeRoleHasSkill(killer, ENUM.SKILL.DETECTIVE_CRIME_GENIUS_1)) { // 侦探<犯罪天才1>不留额外线索
      deadLocation.extraClews.clear();
      nightActionStore.perfumeActive = false;
    }

    if (deadLocation.extraClews.length > 0) {
      deadLocation.extraClews = Utils.uniqueArray(deadLocation.extraClews);
      Utils.shuffleArray(deadLocation.extraClews);
      logText += `${deadLocation.title}留下额外线索<${deadLocation.extraClews.join(" ")}>。`;
    }

    return logText;
  }
};

export default KillerProcessor;
