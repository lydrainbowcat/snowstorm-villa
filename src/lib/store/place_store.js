import { observable, computed } from "mobx";
import Utils from "../utils";
import ENUM from "../constants/enum";

class PlaceStore {
  @observable places = [];
  @observable backupPlace = null;

  @computed get count() {
    return this.places.length;
  }

  addPlace(initPlace) {
    const place = Object.assign({
      roles: [],
      bodies: [],
      method: null,
      clew: null,
      trickMethod: null,
      trickClew: null,
      extraClews: [],
      locked: false
    }, initPlace);
    this.places.push(place);
  }

  getPlace(name) {
    const result = this.places.filter(place => place.name === name);
    return result.length > 0 ? result[0] : null;
  }

  addRoleToPlace(place, role) {
    place.roles.push(role);
  }

  removeRoleFromPlace(place, role) {
    let i = place.roles.indexOf(role);
    if (i > -1) {
      place.roles.splice(i, 1);
    }
  }

  clearInformationOfPlace(place, clearExtra) {
    place.bodies.clear();
    place.method = null;
    place.clew = null;
    place.trickMethod = null;
    place.trickClew = null;
    if (clearExtra) {
      place.extraClews.clear();
    }
  }

  backupInformationOfPlace(place) {
    this.backupPlace = Object.assign({}, place); // shadow copy
    this.backupPlace.bodies = place.bodies.slice(); // deep copy
    this.backupPlace.extraClews = place.extraClews.slice(); // deep copy
  }

  recoverInformation() {
    if (this.backupPlace !== null) {
      const place = this.getPlace(this.backupPlace.name);
      place.bodies = this.backupPlace.bodies.slice();
      place.method = this.backupPlace.method;
      place.clew = this.backupPlace.clew;
      place.trickMethod = this.backupPlace.trickMethod;
      place.trickClew = this.backupPlace.trickClew;
      place.extraClews = this.backupPlace.extraClews.slice();
      this.backupPlace = null;
    }
  }

  clearBackup() {
    this.backupPlace = null;
  }

  clearAllInformation(clearExtra) {
    this.places.forEach(place => this.clearInformationOfPlace(place, clearExtra));
    this.clearBackup();
  }

  shufflePlaceRoles() {
    this.places.forEach(place => Utils.shuffleArray(place.roles)); // 每次移动后所有地点洗牌
  }

  getAllExtraClews() {
    return this.places.reduce((acc, place) => acc.concat(place.extraClews), []);
  }

  clearAllExtraClews() {
    this.places.forEach(place => place.extraClews.clear());
  }

  calcGardenPopulation() {
    const garden = this.getPlace(ENUM.PLACE.GARDEN);
    const balcony = this.getPlace(ENUM.PLACE.BALCONY);
    return garden.roles.length + 2 * balcony.roles.length;
  }
}

const placeStore = new PlaceStore();
export default placeStore;
