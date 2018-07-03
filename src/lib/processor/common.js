import roleStore from "../store/role_store";
import placeStore from "../store/place_store";
import gameStore from "../store/game_store";
import logStore from "../store/log_store";
import Utils from "../utils";

const CommonProcessor = {
  judgeGameForKilling: function() {
    const killer = gameStore.killer;
    if (roleStore.roles.filter(role => role === killer).length === 0) {
      if (roleStore.count === 0) {
        logStore.addLog("游戏结束：所有人死亡，导演胜利。", 1);
      } else {
        logStore.addLog("游戏结束：凶手死亡，受困者胜利。", 1);
      }
      return true;
    }
    if (roleStore.count <= 2) {
      logStore.addLog("游戏结束：受困者存活数过少，凶手胜利。", 1);
      return true;
    }
    return false;
  },

  judgeGameForVoting: function(votedName) {
    const killer = gameStore.killer;
    const votedRole = roleStore.getRole(votedName);
    if (votedRole !== null) {
      logStore.addLog(`游戏结束：${votedRole.title}被公决，${votedRole === killer ? "受困者" : "凶手"}胜利。`);
      return true;
    }
    return false;
  },

  actMove: function(role, place, costMovement) {
    if (costMovement) {
      // 移动次数不足
      if (role.movement < 1) {
        return false;
      }
      role.movement--;
    }
    if (role.location.name === place.name) {
      return false;
    }
    // 目标地点已达人数上限，回到大厅
    if (place.roles.length >= place.capacity) {
      place = placeStore.getPlace("living_room");
    }
    // 执行移动
    placeStore.removeRoleFromPlace(role.location, role);
    placeStore.addRoleToPlace(place, role);
    role.location = place;
    return true;
  },

  getNormalFeedback: function(place) {
    if (place.bodies.length === 0) return "";
    let result = `${place.bodies.join(" ")} ${place.method.title}`;
    if (place.clew) {
      result += ` ${place.clew.title}`;
    }
    return result;
  },

  getFoolFeedback: function(place) {
    if (place.bodies.length === 0) return "";
    let result = `${place.bodies.join(" ")} ${place.trickMethod.title}`;
    if (place.trickClew) {
      result += ` ${place.trickClew.title}`;
    }
    return result;
  },

  canGetExtra: function(place, role, roleMoved) {
    if (place.extraClews.length === 0) return false;
    if (role.inference) return true; // 在场推理
    if (roleMoved && role.keen) return true; // 敏锐移动
    if (role === gameStore.killer && gameStore.killerSacrificing) return true; // 在场献祭
    return false;
  },

  discoverPlaceOnDay: function(place, roleMoved) {
    const killer = gameStore.killer;

    const normalFeedbackString = this.getNormalFeedback(place);
    const foolFeedbackString = this.getFoolFeedback(place);
    const extraFeedbackString = place.extraClews.join(" ");

    let shouldClearExtraClews = false;

    let roleList = place.roles; // 天亮发现线索时，由该地点所有人物共同获得
    if (roleMoved) {
      roleList = [roleMoved]; // 移动阶段发现线索时，仅由发动移动者获得一次
    }

    roleList.forEach(role => {
      const feedbacks = [];
      feedbacks.push(role.fool ? foolFeedbackString : normalFeedbackString);
      if (this.canGetExtra(place, role, roleMoved)) {
        feedbacks.push(extraFeedbackString);
        shouldClearExtraClews = true;
      }

      const finalFeedbackString = feedbacks.filter(f => f !== "").join(" ");
      if (finalFeedbackString !== "") {
        logStore.addLog(`${role.title}收到反馈："${finalFeedbackString}"`);
      }
    });

    if (roleList.length > 0) {
      placeStore.clearInformationOfPlace(place, false);
      // TODO: 清除与线索同名信息（如普通线索零食、额外也是零食）
    }
    if (shouldClearExtraClews) {
      place.extraClews.clear();
    }
  },

  actDayMove: function(role, place, costMovement) { // 白天移动函数
    if (CommonProcessor.actMove(role, place, costMovement)) {
      CommonProcessor.discoverPlaceOnDay(role.location, role); // 移动后判断是否能收到线索
    }
  },

  actNightMove: function(role, place) { // 夜晚移动函数
    if (CommonProcessor.actMove(role, place, false)) {
      if (place.extraClews.length > 0 && role.keen) { // 夜晚移动后仅判定敏锐收线索
        logStore.addLog(`${role.title}收到反馈："${place.extraClews.join(" ")}"`);
        place.extraClews.clear();
      }
    }
  },

  discoverPlacesAtDawn: function() {
    placeStore.places.forEach(place => {
      this.discoverPlaceOnDay(place, null);
    });
    gameStore.setKillerSacrificing(false);
  }
};

export default CommonProcessor;
