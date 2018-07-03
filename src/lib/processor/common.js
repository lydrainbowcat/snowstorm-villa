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
    if (votedName !== null) {
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

  discoverPlaceOnDay: function(place, roleMoved) {
    const killer = gameStore.killer;

    let normalFeedbackString = "";
    let foolFeedbackString = "";

    let shouldClearPlaceInformation = false;
    let shouldClearExtraClews = false;

    // 尸体信息
    if (place.bodies.length > 0) {
      normalFeedbackString = `${place.bodies.join(" ")} ${place.method.title}`;
      if (place.clew) {
        normalFeedbackString += ` ${place.clew.title}`;
      }
      foolFeedbackString = `${place.bodies.join(" ")} ${place.trickMethod.title}`;
      if (place.trickClew) {
        foolFeedbackString += ` ${place.trickClew.title}`;
      }
    }

    let roleList = place.roles; // 天亮发现线索时，由该地点所有人物共同获得
    if (roleMoved) {
      roleList = [roleMoved]; // 移动阶段发现线索时，仅由发动移动者获得一次
    }

    roleList.forEach(role => {
      let extraFeedbackString = "";
      // 敏锐的移动者 或 在场的推理者 得到额外线索
      if (place.extraClews.length > 0 && ((roleMoved && role.keen) || role.inference ||
        (role === killer && gameStore.killerSacrificing))) {
        extraFeedbackString = place.extraClews.join(" ");
        shouldClearExtraClews = true;
      }

      let thisFeedbackString = role.fool ? foolFeedbackString : normalFeedbackString;
      if (thisFeedbackString !== "" && extraFeedbackString !== "") {
        thisFeedbackString += " ";
      }

      shouldClearPlaceInformation = true;
      if (thisFeedbackString !== "" || extraFeedbackString !== "") {
        logStore.addLog(`${role.title}收到反馈："${thisFeedbackString}${extraFeedbackString}"`);
      }
    });

    if (shouldClearPlaceInformation) {
      placeStore.clearInformationOfPlace(place, false);
      // TODO: 清除与线索同名信息（如普通线索零食、额外也是零食）
    }
    if (shouldClearExtraClews) {
      place.extraClews.clear();
    }
    if (place === killer.location) {
      gameStore.setKillerSacrificing(false);
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
    })
  }
};

export default CommonProcessor;
