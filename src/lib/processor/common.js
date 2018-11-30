import ENUM from "../constants/enum";
import Utils from "../utils";

import roleStore from "../store/role_store";
import placeStore from "../store/place_store";
import gameStore from "../store/game_store";
import logStore from "../store/log_store";
import nightActionStore from "../store/night_action_store";
import dayActionStore from "../store/day_action_store";
import SkillProcessor from "./skill";

const CommonProcessor = {
  judgeGameForKilling: function() {
    const killer = gameStore.killer;
    if (roleStore.roles.filter(role => role === killer).length === 0) {
      if (roleStore.count === 0) {
        logStore.addLog("游戏结束：所有人死亡，导演胜利。");
      } else {
        logStore.addLog("游戏结束：凶手死亡，受困者胜利。");
      }
      return true;
    }
    if (roleStore.count <= 2) {
      logStore.addLog("游戏结束：受困者存活数过少，凶手胜利。");
      return true;
    }
    if (gameStore.finalDay === gameStore.day + 1 && !gameStore.someoneKilled) {
      logStore.addLog("游戏结束：凶手未能犯下任何杀人案，受困者胜利。");
      return true;
    }
    return false;
  },

  judgeGameForVoting: function(votedName) {
    const killer = gameStore.killer;
    const votedRole = roleStore.getRole(votedName);
    if (votedRole !== null) {
      roleStore.killRole(votedRole);
      logStore.addLog(`游戏结束：${votedRole.title}被公决，${votedRole === killer ? "受困者" : "凶手"}胜利。`);
      return true;
    } else if (gameStore.finalDay === gameStore.day) {
      logStore.addLog(`游戏结束：最终之日无人被公决，凶手胜利。`);
      return true;
    }
    return false;
  },

  actMove: function(role, place, costMovement) {
    if (role.movement < 0) return false; // 警察<警戒>中
    let cost = costMovement;
    // 学生<旧日梦魇2>，特定条件下有一次额外移动（不消耗移动次数）
    if (SkillProcessor.judgeRoleHasSkill(role, ENUM.SKILL.STUDENT_NIGHTMARE) && !dayActionStore.nightmare.moved &&
        (place.name === dayActionStore.nightmare.place.name || role.location.name === dayActionStore.nightmare.place.name)) {
      cost = false;
      dayActionStore.nightmare.moved = true;
    }
    if (cost) {
      if (role.movement < 1) { // 移动次数不足
        return false;
      }
      if (!(role.location.name === ENUM.PLACE.BALCONY && place.name === ENUM.PLACE.BEDROOM)) { // 阳台<观景3>：阳台到卧室不消耗移动次数
        role.movement--;
      }
    }

    if (role.location.name === place.name) {
      return false;
    }

    if (!SkillProcessor.judgeRoleHasSkill(role, ENUM.SKILL.HIGH_SCHOOL_STUDENT_DEXTEROUS)) { // 地形或技能效果限制，<灵巧>技能除外
      if (!(role.location.name === ENUM.PLACE.BALCONY && place.name === ENUM.PLACE.BEDROOM)) { // 从阳台<观景3>移动到卧室必定成功
        if (place.locked || role.location.locked) { // 目标地点或起始地点被锁住
          return false;
        }
        if (place.sealed) { // 卧室<密室1>
          logStore.addLog(`${role.title}收到反馈："门打不开！"`, 2);
          this.activeKillerTrack(null);
          return false;
        }
      }
      if (place.roles.length >= place.capacity) { // 目标地点已达人数上限，回到大厅
        place = placeStore.getPlace(ENUM.PLACE.LIVING_ROOM);
      }
    }

    // 执行移动
    placeStore.removeRoleFromPlace(role.location, role);
    placeStore.addRoleToPlace(place, role);
    placeStore.shufflePlaceRoles(); // 每次移动后所有地点洗牌
    role.location = place;
    place.sealed = false; // 卧室<密室2>：成功移动时密室特性消失
    return true;
  },

  canDiscover: function(place) { // 花园<复杂地形4>
    return !(place.name === ENUM.PLACE.GARDEN && placeStore.calcGardenPopulation() < place.capacity);
  },

  getBodiesAndMethod: function(place, isTrick) {
    if (place.bodies.length === 0 || !this.canDiscover(place)) return [[], null];
    return [place.bodies.slice(), isTrick ? place.trickMethod : place.method];
  },

  canGetClew: function(clew, place, role) {
    if (!clew) return false;
    if (clew.type === 1 && SkillProcessor.judgeRoleHasSkill(role, ENUM.SKILL.MANAGER_HOST_ADVANTAGE_1)) return true; // 管理员<主场优势1>
    if (!this.canDiscover(place)) return false;
    if (clew.name === "soil" && place.name === ENUM.PLACE.GARDEN) return false;
    if (clew.name === "snack" && place.name === ENUM.PLACE.KITCHEN) return false;
    if (clew.name === "water" && place.name === ENUM.PLACE.TOILET) return false;
    return true;
  },

  getNormalFeedback: function(place, role) {
    const result = this.getBodiesAndMethod(place, false);
    if (this.canGetClew(place.clew, place, role)) result.push(place.clew); else result.push(null);
    return result;
  },

  getFoolFeedback: function(place, role) {
    const result = this.getBodiesAndMethod(place, true);
    if (this.canGetClew(place.trickClew, place, role)) result.push(place.trickClew); else result.push(null);
    return result;
  },

  canGetExtra: function(role, roleMoved) {
    if (role.inference) return true; // 在场推理
    if (roleMoved && role.keen) return true; // 敏锐移动
    if (role === gameStore.killer && gameStore.killerSacrificing) return true; // 在场献祭
    return false;
  },

  getExtraClews: function(place, role, roleMoved) {
    if (!this.canGetExtra(role, roleMoved)) return [];
    const result = place.extraClews.slice();
    if (place.name === ENUM.PLACE.GARDEN)
      return result.filter(c => c.title !== "泥土");
    if (place.name === ENUM.PLACE.TOILET)
      return result.filter(c => c.title !== "水迹");
    if (place.name === ENUM.PLACE.KITCHEN && !SkillProcessor.judgeRoleHasSkill(role, ENUM.SKILL.MANAGER_HOST_ADVANTAGE_1))
      return result.filter(c => c.title !== "零食"); // 管理员<主场优势1>
    return result;
  },

  discoverPlaceOnDay: function(place, roleMoved) {
    let discoveredClews = false;
    let discoveredExtraClews = [];
    let discoveredBodiesAndMethod = false;

    let roleList = place.roles; // 天亮发现线索时，由该地点所有人物共同获得
    if (roleMoved) {
      roleList = [roleMoved]; // 移动阶段发现线索时，仅由发动移动者获得一次
    }

    roleList.forEach(role => {
      let feedbacks = role.fool ^ dayActionStore.trickReversed ? // [[尸体数组], 手法, 线索]
        this.getFoolFeedback(place, role) :
        this.getNormalFeedback(place, role);
      discoveredBodiesAndMethod = discoveredBodiesAndMethod || (feedbacks[0].length > 0); // 发现尸体
      discoveredClews = discoveredClews || (feedbacks[2] !== null);

      const extraFeedbacks = this.getExtraClews(place, role, roleMoved);
      const intactCrimeInformation = !gameStore.killerTrackActive &&
        feedbacks[0].length > 0 && feedbacks[1] !== null && feedbacks[2] !== null;

      if (intactCrimeInformation && SkillProcessor.judgeRoleHasSkill(role, ENUM.SKILL.MISTERIOUS_MAN_EXPERT_2)) { // 技能<轻车熟路2>
        const infoTypeTitle = role.fool ^ dayActionStore.trickReversed ? "诡计信息" : "犯罪信息";
        logStore.addLog(`${role.title}收到反馈："你收到的是${infoTypeTitle}"`, 2);
      }

      role.killerTrackActivatable = role.killerTrackActivatable || intactCrimeInformation; // 拉警报的允许时间会一直持续到投票之前

      if (feedbacks[1]) feedbacks[0].push(feedbacks[1].title);
      if (feedbacks[2]) feedbacks[0].push(feedbacks[2].title);
      feedbacks = feedbacks[0];
      feedbacks = feedbacks.concat(extraFeedbacks.map(c => c.title));
      discoveredExtraClews = discoveredExtraClews.concat(extraFeedbacks);

      feedbacks = Utils.uniqueArray(feedbacks);
      if (feedbacks.length > 0) {
        SkillProcessor.addCriminalInvestFeedback(role, feedbacks); // 技能<刑事侦查>
        logStore.addLog(`${role.title}收到反馈："${feedbacks.join(" ")}"`, 2);
      }
    });

    if (roleList.length > 0) { // 清除已经获得的尸体信息，侦探<平凡侦探>、学生<旧日梦魇2>可保留
      const remainInfo = (dayActionStore.detective && roleList.filter(r => r.name === ENUM.ROLE.DETECTIVE).length > 0) ||
        (dayActionStore.nightmare.place !== null && place.name === dayActionStore.nightmare.place.name);
      if (!remainInfo) placeStore.clearInformationOfPlace(place, discoveredBodiesAndMethod, discoveredClews);
    }
    if (!(dayActionStore.detective && roleList.filter(r => r.name === ENUM.ROLE.DETECTIVE).length > 0)) { // 清除已经获得过的额外线索，侦探<平凡侦探>可保留
      placeStore.clearExtraClewsOfPlace(place, discoveredExtraClews); 
    }
  },

  actDayMove: function(role, place, costMovement) { // 白天移动函数
    if (CommonProcessor.actMove(role, place, costMovement)) {
      CommonProcessor.discoverPlaceOnDay(role.location, role); // 移动后判断是否能收到线索
    }
  },

  actNightMove: function(role, place) { // 夜晚移动函数
    if (CommonProcessor.actMove(role, place, false)) {
      const extraClews = placeStore.getVisibleExtraClews(place);
      if (extraClews.length > 0 && role.keen) { // 夜晚移动后仅判定敏锐收线索
        logStore.addLog(`${role.title}收到反馈："${extraClews.map(c => c.title).join(" ")}"`, 2);
        placeStore.clearExtraClewsOfPlace(extraClews);
      }
    }
  },

  discoverPlacesAtDawn: function() {
    placeStore.places.forEach(place => {
      this.discoverPlaceOnDay(place, null);
      place.locked = false;
    });
    gameStore.setKillerSacrificing(false);

    placeStore.shufflePlaceRoles(); // 天亮后所有地点洗牌
    if (nightActionStore.killerTrack) {
      logStore.addLog(`导演公告："昨天晚上有人发现了凶手行踪。"`, 2);
    }
  },

  activeKillerTrack: function(role) {
    if (gameStore.killerTrackActive) return; // 已激活
    if (role) logStore.addLog(`${role.title}要求公告："发现凶案！"`, 2);
    else logStore.addLog(`导演公告："发现凶案！"`, 2);
    gameStore.killerTrackActive = true; // 激活凶手行踪
    roleStore.clearKillerTrackActivatable();
  },

  randomMove: function() {
    const roles = roleStore.roles;
    const places = placeStore.places;
    roles.forEach(role => {
      const dst = Utils.randElement(places);
      console.log("random move", role.title, role.location.title, dst.title);
      this.actDayMove(role, dst, true);
      dayActionStore.setMovementOfRole(role, role.location);
    })
  }
};

export default CommonProcessor;
