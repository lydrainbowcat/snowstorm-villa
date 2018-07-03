import placeStore from "./store/place_store";
import logStore from "./store/log_store";
import gameStore from "./store/game_store";

const Utils = {
  actMove: function(role, place, costMovement) {
    if (costMovement) {
      if (role.movement < 1) {
        return false;
      }
      role.movement--;
    }
    if (role.location.name === place.name) {
      return false;
    }
    if (place.roles.length >= place.capacity) {
      place = placeStore.getPlace("living_room");
    }
    placeStore.removeRoleFromPlace(role.location, role);
    placeStore.addRoleToPlace(place, role);
    role.location = place;
    return true;
  },

  dayDiscoverPlace: function(place, roleMoved) {
    const killer = gameStore.killer;

    let normalFeedbackString = "";
    let foolFeedbackString = "";

    let shouldClearPlaceInformation = false;
    let shouldClearExtraClews = false;

    if (place.bodies.length > 0) {
      normalFeedbackString = `${place.bodies.join(" ")} ${place.method.title} `;
      if (place.clew) {
        normalFeedbackString += place.clew.title;
      }
      foolFeedbackString = `${place.bodies.join(" ")} ${place.trickMethod.title} `;
      if (place.trickClew) {
        foolFeedbackString += place.trickClew.title;
      }
    }

    let roleList = place.roles; // 天亮发现线索时，由该地点所有人物共同获得
    if (roleMoved) {
      roleList = [roleMoved]; // 移动阶段发现线索时，仅由发动移动者获得单次额外线索
    }

    roleList.forEach(role => {
      let extraFeedbackString = "";
      if (place.extraClews.length > 0 && ((roleMoved && role.keen) || role.inference ||
        (role === killer && gameStore.killerSacrificing))) { // 敏锐移动至新地点/推理/天亮时献祭 获得额外线索
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
    if (place === killer.location) { // 扫描凶手所在地时清除献祭标识
      gameStore.setKillerSacrificing(false);
    }
  },

  actDayMove: function(role, place, costMovement) { // 白天移动函数
    if (Utils.actMove(role, place, costMovement)) {
      Utils.dayDiscoverPlace(role.location, role); // 移动后判断是否能收到线索
    }
  },

  actNightMove: function(role, place) { // 夜晚移动函数
    if (Utils.actMove(role, place, false)) {
      if (place.extraClews.length > 0 && role.keen) { // 夜晚移动后仅判定敏锐收线索
        logStore.addLog(`${role.title}收到反馈："${place.extraClews.join(" ")}"`);
        place.extraClews.clear();
      }
    }
  },

  shuffleArray: function(arr) {
    let i = arr.length;
    let j = 0;
    while (i) {
      j = Math.floor(Math.random() * i--);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  },

  randInt: function(n) {
    return Math.floor(Math.random() * n);
  },

  randElement: function (arr) {
    return arr[Utils.randInt(arr.length)];
  },

  randElementExceptIn: function(arr, exceptList) {
    let index = null;
    do {
      index = Utils.randInt(arr.length);
    } while (exceptList.indexOf(arr[index]) !== -1);
    return arr[index];
  },

  randElementExceptNameIn: function(arr, exceptList) {
    let index = null;
    do {
      index = Utils.randInt(arr.length);
    } while (exceptList.indexOf(arr[index].name) !== -1);
    return arr[index];
  }
};

export default Utils;
