import { observable } from "mobx";
import ENUM from "../constants/enum";
import placeStore from "./place_store";

class DayActionStore {
  @observable movements = {};

  // 女驴友<探险精神>
  @observable exploration = null;

  // 男驴友<缜密心思>每天只能用一次
  @observable usedMeticulous = false;

  // 男驴友<特制陷阱>
  @observable trickReversed = false;

  getMovementOfRole(role) {
    return this.movements[role.name] || placeStore.getPlace(ENUM.PLACE.LIVING_ROOM);
  }

  setMovementOfRole(role, place) {
    this.movements[role.name] = place;
  }

  renewMovements() {
    this.movements = {};
  }

  renew() {
    this.renewMovements();
    this.usedMeticulous = false;
    this.trickReversed = false;
  }
}

const dayActionStore = new DayActionStore();
export default dayActionStore;
