import { observable, computed } from "mobx";
import CLEWS from "../constants/clew";
import METHODS from "../constants/method";
import Utils from "../utils";

import gameStore from "../store/game_store";
import placeStore from "../store/place_store";
import roleStore from "../store/role_store";

class NightActionStore {
  @observable targetType = "role"; // "role" or "place"
  @observable targetRole = null;
  @observable targetPlace = null;
  @observable method = null;
  @observable clew = null;
  @observable trickMethod = null;
  @observable trickClew = null;

  @observable canJoviality = false;
  @observable killerTrack = false;
  @observable acting = 0; // 结算进度，0-未结算，1-已结算作案前技能（刀法失败），2-结算完毕

  // 猎人<求生本能>
  @observable struggleFrom = null;

  // 女医生<香水>
  @observable perfumeActive = false;

  // 女医生<心理暗示>
  @observable implyMethod = null;
  @observable implyClew = null;
  @observable mindImply = { enabled: false, role: null, place: null };

  // 男医生<思维诊疗>
  @observable brainDiagnosis = { enabled: 0, targets: [] };

  renew() {
    this.targetType = "role";
    this.targetRole = this.targetPlace = this.method = this.clew = this.trickMethod = this.trickClew = this.implyMethod = this.implyClew = null;
    this.canJoviality = this.killerTrack = false;
    this.acting = 0;
  }

  @computed get mindImplySummary() {
    const mi = this.mindImply;
    return mi.enabled && mi.role && mi.place ? `${mi.role.title}→${mi.place.title}` : "";
  }

  enableMindImply(enabled) {
    if (enabled) {
      this.mindImply.enabled = true;
    } else {
      this.mindImply = { enabled: false, role: null, place: null };
    }
  }

  @computed get brainDiagnosisSummary() {
    const bd = this.brainDiagnosis;
    const targets = bd.targets.filter(t => t !== null);
    return bd.enabled > 0 && targets.length > 0 ? `${bd.enabled}-${targets.map(t => t.title).join(",")}` : "";
  }

  enableBrainDiagnosis(enabled) {
    if (enabled > 0) {
      this.brainDiagnosis = { enabled: enabled, targets: [null, null] };
    } else {
      this.brainDiagnosis = { enabled: 0, targets: [] };
    }
  }

  randomKill() {
    const killer = gameStore.killer;
    const methodName = Utils.randElementExceptIn(killer.methods, [gameStore.lastMethodName]);
    const clewName = Utils.randElementExceptIn(killer.clews, gameStore.usedClewsName);

    this.setTargetType(["role", "place"][Utils.randInt(2)]);
    this.setTargetRole(Utils.randElementExceptNameIn(roleStore.roles, [killer.name]));
    this.setTargetPlace(Utils.randElement(placeStore.places));
    this.setMethod(METHODS.filter(method => method.name === methodName)[0]);
    this.setClew(CLEWS.filter(clew => clew.name === clewName)[0]);
    this.setTrickMethod(Utils.randElement(METHODS));
    this.setTrickClew(Utils.randElement(CLEWS));
  }

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

  setCanJoviality(_canJoviality) {
    this.canJoviality = _canJoviality;
  }

  setImplyMethod(_implyMethod) {
    this.implyMethod = _implyMethod;
  }

  setImplyClew(_implyClew) {
    this.implyClew = _implyClew;
  }

  setMindImplyRole(_implyRole) {
    this.mindImply.role = _implyRole;
  }

  setMindImplyPlace(_implyPlace) {
    this.mindImply.place = _implyPlace;
  }

  addBrainDiagnosisTarget(index, target) {
    this.brainDiagnosis.targets[index] = target;
  }
}

const nightActionStore = new NightActionStore();
export default nightActionStore;
