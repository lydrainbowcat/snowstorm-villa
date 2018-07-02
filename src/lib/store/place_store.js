import { observable, computed } from "mobx";
import Utils from "../utils";

class PlaceStore {
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
      extraClews: []
    }, initPlace);
    this.places.push(place);
  }

  getPlace(name) {
    const result = this.places.filter(place => place.name === name);
    return result.length > 0 ? result[0] : null;
  }

  addRoleToPlace(place, role) {
    place.roles.push(role);
    Utils.shuffleArray(place.roles);
  }

  removeRoleFromPlace(place, role) {
    let i = place.roles.indexOf(role);
    if (i > -1) {
      place.roles.splice(i, 1);
      Utils.shuffleArray(place.roles);
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

  clearAllInformation(clearExtra) {
    this.places.forEach(place => this.clearInformationOfPlace(place, clearExtra));
  }
}

const placeStore = new PlaceStore();
export default placeStore;
