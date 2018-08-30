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

  // 教练<鞭策>
  @observable inspiration = {
    used: [false, false],
    selected: null,
    keenUntilNight: null
  };

  // 导游<完美记忆>
  @observable perfectMemory = {used: false, place: null};

  // 道具师<玩具巡逻车>
  @observable toyCarPlace = null;

  // 学生<旧日梦魇>持续效果
  @observable nightmare = { place: null, moved: true, keenUntilNight: null };

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
    if (this.inspiration.keenUntilNight !== null) { // 因教练<鞭策>获得敏锐，天黑失去
      this.inspiration.keenUntilNight.keen = 0;
    }
    this.inspiration = {
      used: [false, false],
      selected: null,
      keenUntilNight: null
    };
    this.perfectMemory = {used: false, place: null};
    if (this.nightmare.keenUntilNight !== null) { // 因学生<旧日梦魇>获得敏锐，天黑失去
      this.nightmare.keenUntilNight.keen = 0;
    }
    this.nightmare = { place: null, moved: true, keenUntilNight: null };
  }
}

const dayActionStore = new DayActionStore();
export default dayActionStore;
