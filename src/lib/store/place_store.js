import { observable, computed } from "mobx";

class PlaceStore {
  @observable places = [];

  @computed get count() {
    return this.places.length;
  }

  addPlace(initPlace) {
    const place = Object.assign({
      roles: []
    }, initPlace);
    this.places.push(place);
  }

  getRoles(name) {
    const result = this.places.filter(place => place.name === name);
    return result.length > 0 ? result[0] : null;
  }

  setRoles(name, roles) {
    const place = getRoles(name);
    place.roles = roles;
  }
}

const placeStore = new PlaceStore();
export default placeStore;
