import placeStore from "./store/place_store";
import logStore from "./store/log_store";
import roleStore from "./store/role_store";

const Utils = {
  actMove: function(role, place) {
    if (role.movement < 1) {
      return false;
    }
    role.movement--;
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

  renewMovement: function() {
    const roles = roleStore.roles;
    roles.forEach(role => role.movement = 1);
  },

  clearPlaceInformation: function(place, clearExtra) {
    place.bodies.clear();
    place.method = null;
    place.clew = null;
    place.trickMethod = null;
    place.trickClew = null;
    if (clearExtra) {
      place.extraClews.clear();
    }
  },

  roleDiscoverPlace: function(place, keenValid) {
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

    place.roles.forEach(role => {
      let extraFeedbackString = "";
      if (place.extraClews.length > 0 && ((keenValid && role.keen) || role.inference)) {
        extraFeedbackString = place.extraClews.join(" "); // TODO: 多个额外线索乱序
        shouldClearExtraClews = true;
      }
      let thisFeedbackString = role.fool ? foolFeedbackString : normalFeedbackString;
      shouldClearPlaceInformation = true;
      if (thisFeedbackString !== "" || extraFeedbackString !== "") {
        logStore.addLog(`${role.title}收到反馈："${thisFeedbackString} ${extraFeedbackString}"`);
      }
    });

    if (shouldClearPlaceInformation) {
      Utils.clearPlaceInformation(place);
      // TODO: 清除与线索同名信息（如普通线索零食、额外也是零食）
    }
    if (shouldClearExtraClews) {
      place.extraClews.clear();
    }
  }
};

export default Utils;
