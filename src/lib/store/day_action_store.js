import { observable } from "mobx";
import ENUM from "../constants/enum";
import placeStore from "./place_store";

class DayActionStore {
  @observable movements = {};

  getMovementOfRole(role) {
    return this.movements[role.name] || placeStore.getPlace(ENUM.PLACE.LIVING_ROOM);
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
