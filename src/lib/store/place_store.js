import { observable, computed } from "mobx";

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
  }

  removeRoleFromPlace(place, role) {
    let i = place.roles.indexOf(role);
    if (i > -1) place.roles.splice(i, 1);
  }
}

const placeStore = new PlaceStore();
export default placeStore;
