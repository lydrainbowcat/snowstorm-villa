import { observable } from "mobx";

class GameStore {
  @observable period = 0;

  setPeriod(nextPeriod) {
    this.period = nextPeriod;
  }
}

const gameStore = new GameStore();
export default gameStore;
