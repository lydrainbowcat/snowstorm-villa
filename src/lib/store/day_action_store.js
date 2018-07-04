import { observable } from "mobx";
import placeStore from "./place_store";

class DayActionStore {
  @observable movements = {};

  getMovementOfRole(role) {
    return this.movements[role.name] || placeStore.getPlace("living_room");
  }

  setMovementOfRole(role, place) {
    this.movements[role.name] = place;
  }

  renewMovements() {
    this.movements = {};
  }
}

const dayActionStore = new DayActionStore();
export default dayActionStore;
