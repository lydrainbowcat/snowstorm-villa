import { observable } from "mobx";
import MOTIVATIONS from "../constants/motivation";

class GameStore {
  @observable period = 0;
  @observable motivation = {};
  @observable killer = null;
  @observable lastMethodName = null;
  @observable usedClewsName = [];

  setPeriod(nextPeriod) {
    this.period = nextPeriod;
  }

  setMotivation(name) {
    this.motivation = MOTIVATIONS.filter(m => m.name === name)[0];
  }

  setKiller(role) {
    this.killer = role;
  }
}

const gameStore = new GameStore();
export default gameStore;
