import { observable } from "mobx";
import MOTIVATIONS from "../constants/motivation";
import logStore from "./log_store";

class GameStore {
  @observable period = 0;
  @observable motivation = {};
  @observable killer = null;
  @observable lastMethodName = null;
  @observable usedClewsName = [];
  @observable scudUsed = false;
  @observable killerSacrificing = false;

  setPeriod(nextPeriod) {
    logStore.renewAlerts();
    this.period = nextPeriod;
  }

  setMotivation(name) {
    this.motivation = MOTIVATIONS.filter(m => m.name === name)[0];
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
