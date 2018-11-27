import { observable } from "mobx";
import MOTIVATIONS from "../constants/motivation";
import logStore from "./log_store";

class GameStore {
  @observable day = 0;
  @observable finalDay = 3;
  @observable someoneKilled = false;

  @observable period = 0;
  @observable motivations = [];
  @observable killer = null;

  @observable lastMethodName = null;
  @observable usedClewsName = [];
  @observable scudUsed = false;
  @observable killerSacrificing = false;

  @observable killerTrackActive = false;
  @observable bedroomExtraActive = 0; // 0-未点杀过卧室角色，1-第一次点杀卧室角色需要留下额外线索，2-已点杀过卧室角色

  nextDay() {
    ++this.day;
  }

  reachFinalDay() {
    return this.day === this.finalDay;
  }

  setPeriod(nextPeriod) {
    logStore.renewAlerts();
    this.period = nextPeriod;
  }

  addMotivation(name) {
    this.motivations.push(MOTIVATIONS.filter(m => m.name === name)[0]);
  }

  setKiller(role) {
    this.killer = role;
  }

  setScudUsed(_scudUsed) {
    this.scudUsed = _scudUsed;
  }

  setKillerSacrificing(_killerSacrificing) {
    this.killerSacrificing = _killerSacrificing;
  }
}

const gameStore = new GameStore();
export default gameStore;
