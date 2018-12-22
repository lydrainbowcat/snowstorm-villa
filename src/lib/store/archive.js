import gameStore from "./game_store";
import logStore from "./log_store";
import placeStore from "./place_store";
import roleStore from "./role_store";
import dayActionStore from "./day_action_store";
import nightActionStore from "./night_action_store";

class Archive {
  archives = [];

  assignData(protos, src, dst = {}) {
    protos.value.forEach(key => dst[key] = src[key]);
    protos.array.forEach(key => dst[key] = src[key].slice());
    protos.map.forEach(key => dst[key] = Object.assign({}, src[key]));
    return dst;
  }

  copyStore(store) {
    return this.assignData(store.protos, store);
  }

  copyPlaceStore(store) {
    const replica = {};
    replica["places"] = store.places.map(s => this.assignData(store.protos, s));
    return replica;
  }

  copyRoleStore(store) {
    const replica = {};
    replica["roles"] = store.roles.map(s => this.assignData(store.protos, s));
    replica["deadRoles"] = store.deadRoles.map(s => this.assignData(store.protos, s));
    return replica;
  }

  recoverStore(store, replica) {
    return this.assignData(store.protos, replica, store);
  }

  recoverPlaceStore(store, replica) {
    replica.places.forEach(a => {
      const place = store.getPlace(a.name);
      this.assignData(store.protos, a, place);
    });
  }

  recoverRoleStore(store, replica) {
    const allRoles = store.roles.concat(store.deadRoles);
    store.roles.clear();
    store.deadRoles.clear();
    replica.roles.forEach(a => {
      const role = allRoles.filter(r => r.name === a.name)[0];
      this.assignData(store.protos, a, role);
      store.roles.push(role);
    });
    replica.deadRoles.forEach(a => {
      const role = allRoles.filter(r => r.name === a.name)[0];
      this.assignData(store.protos, a, role);
      store.deadRoles.push(role);
    });
  }

  save() {
    logStore.addLog(this.archives.length, -1);
    this.archives.push([
      this.copyStore(gameStore),
      this.copyStore(logStore),
      this.copyPlaceStore(placeStore),
      this.copyRoleStore(roleStore),
      this.copyStore(dayActionStore),
      this.copyStore(nightActionStore)
    ]);
  }

  load(index) {
    const archive = this.archives[index];
    this.archives.splice(index + 1, this.archives.length - index - 1);
    this.recoverStore(nightActionStore, archive[5]);
    this.recoverStore(dayActionStore, archive[4]);
    this.recoverRoleStore(roleStore, archive[3]);
    this.recoverPlaceStore(placeStore, archive[2]);
    this.recoverStore(logStore, archive[1]);
    this.recoverStore(gameStore, archive[0]);
  }
}

const archive = new Archive();
export default archive;
