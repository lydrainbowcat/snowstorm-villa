import { observable } from "mobx";
import CLEWS from "../constants/clew";
import METHODS from "../constants/method";
import Utils from "../utils";

import gameStore from "../store/game_store";
import placeStore from "../store/place_store";
import roleStore from "../store/role_store";

class NightActionStore {
  @observable targetType = "role"; // 'role' or 'place'
  @observable targetRole = null;
  @observable targetPlace = null;
  @observable method = null;
  @observable clew = null;
  @observable trickMethod = null;
  @observable trickClew = null;

  @observable canJoviality = false;
  @observable killerTrack = false;

  setTargetType(_targetType) {
    this.targetType = _targetType;
  }

  setTargetRole(_targetRole) {
    this.targetRole = _targetRole;
  }

  setTargetPlace(_targetPlace) {
    this.targetPlace = _targetPlace;
  }

  setMethod(_method) {
    this.method = _method;
  }

  setClew(_clew) {
    this.clew = _clew;
  }

  setTrickMethod(_trickMethod) {
    this.trickMethod = _trickMethod;
  }

  setTrickClew(_trickClew) {
    this.trickClew = _trickClew;
  }

  renew() {
    this.targetType = "role";
    this.targetRole = this.targetPlace = this.method = this.clew = this.trickMethod = this.trickClew = null;
    this.canJoviality = this.killerTrack = false;
  }

  randomKill() {
    const killer = gameStore.killer;
    const methodName = Utils.randElementExceptIn(killer.methods, [gameStore.lastMethodName]);
    const clewName = Utils.randElementExceptIn(killer.clews, gameStore.usedClewsName);

    this.setTargetType(['role', 'place'][Utils.randInt(2)]);
    this.setTargetRole(Utils.randElementExceptNameIn(roleStore.roles, [killer.name]));
    this.setTargetPlace(Utils.randElement(placeStore.places));
    this.setMethod(METHODS.filter(method => method.name === methodName)[0]);
    this.setClew(CLEWS.filter(clew => clew.name === clewName)[0]);
    this.setTrickMethod(Utils.randElement(METHODS));
    this.setTrickClew(Utils.randElement(CLEWS));
  }

  setCanJoviality(_canJoviality) {
    this.canJoviality = _canJoviality;
  }
}

const nightActionStore = new NightActionStore();
export default nightActionStore;
