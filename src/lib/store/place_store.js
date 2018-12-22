import { observable, computed } from "mobx";
import Utils from "../utils";
import ENUM from "../constants/enum";

class PlaceStore {
  protos = {
    path: ["places"],
    value: ["method", "clew", "trickMethod", "trickClew", "locked", "sealed"],
    array: ["roles", "bodies", "extraClews"],
    map: [],
  };

  @observable places = [];

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
      locked: false, // 机关锁
      sealed: false // 密室
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

  clearAllInformation() {
    this.places.forEach(place => {
      place.bodies.clear();
      place.method = null;
      place.clew = null;
      place.trickMethod = null;
      place.trickClew = null;
      place.extraClews.clear();
      place.sealed = false;
    });
  }

  shufflePlaceRoles() {
    this.places.forEach(place => Utils.shuffleArray(place.roles)); // 每次移动后所有地点洗牌
  }

  clearInformationOfPlace(place, clearBodies, clearClews) {
    if (clearBodies) {
      place.bodies.clear();
      place.method = null;
      place.trickMethod = null;
    }
    if (clearClews) {
      place.clew = null;
      place.trickClew = null;
    }
  }

  getVisibleExtraClews(place) {
    if (place.name === ENUM.PLACE.GARDEN) return place.extraClews.filter(c => c.name !== "soil");
    if (place.name === ENUM.PLACE.KITCHEN) return place.extraClews.filter(c => c.name !== "snack");
    if (place.name === ENUM.PLACE.TOILET) return place.extraClews.filter(c => c.name !== "water");
    return place.extraClews;
  }

  getAllExtraClewTitles() {
    return this.places.reduce((acc, place) => acc.concat(place.extraClews), []).map(c => c.title);
  }

  clearExtraClewOfPlace(place, clew) {
    place.extraClews = place.extraClews.filter(c => c.name !== clew.name);
  }

  clearExtraClewsOfPlace(place, clews) {
    clews.forEach(clew => this.clearExtraClewOfPlace(place, clew));
  }

  clearAllExtraClews() {
    this.places.forEach(place => place.extraClews.clear());
  }

  calcGardenPopulation() {
    const garden = this.getPlace(ENUM.PLACE.GARDEN);
    const balcony = this.getPlace(ENUM.PLACE.BALCONY);
    return garden.roles.length + (balcony ? 2 * balcony.roles.length : 0);
  }
}

const placeStore = new PlaceStore();
export default placeStore;
