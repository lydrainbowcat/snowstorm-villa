import gameStore from "./game_store";
import logStore from "./log_store";
import placeStore from "./place_store";
import roleStore from "./role_store";
import dayActionStore from "./day_action_store";
import nightActionStore from "./night_action_store";

class Archive {
  archives = [];

  copyStore(store) {
    const a = {};
    if (!store.protos["path"]) {
      store.protos.value.forEach(key => a[key] = store[key]);
      store.protos.array.forEach(key => a[key] = store[key].slice());
      store.protos.map.forEach(key => a[key] = Object.assign({}, store[key]));
    } else { // 人物、地点存储特制
      store.protos.path.forEach(path =>
        a[path] = store[path].map(s => {
          const b = {};
          store.protos.value.forEach(key => b[key] = s[key]);
          store.protos.array.forEach(key => b[key] = s[key].slice());
          store.protos.map.forEach(key => b[key] = Object.assign({}, s[key]));
          return b;
        })
      );
    }
    return a;
  }

  recoverStore(store, a) {
    if (!store.protos["path"]) {
      store.protos.value.forEach(key => store[key] = a[key]);
      store.protos.array.forEach(key => store[key] = a[key].slice());
      store.protos.map.forEach(key => store[key] = Object.assign({}, a[key]));
    } else {
      store.protos.path.forEach(path =>
        store[path] = a[path].map(b => {
          const s = {};
          store.protos.value.forEach(key => s[key] = b[key]);
          store.protos.array.forEach(key => s[key] = b[key].slice());
          store.protos.map.forEach(key => s[key] = Object.assign({}, b[key]));
          return s;
        })
      );
    }
  }

  save() {
    logStore.addLog(this.archives.length, -1);
    this.archives.push([
      this.copyStore(gameStore),
      this.copyStore(logStore),
      this.copyStore(placeStore),
      this.copyStore(roleStore),
      this.copyStore(dayActionStore),
      this.copyStore(nightActionStore)
    ]);
  }

  load(index) {
    const archive = this.archives[index];
    this.archives.splice(index + 1, this.archives.length - index - 1);
    this.recoverStore(nightActionStore, archive[5]);
    this.recoverStore(dayActionStore, archive[4]);
    this.recoverStore(roleStore, archive[3]);
    this.recoverStore(placeStore, archive[2]);
    this.recoverStore(logStore, archive[1]);
    this.recoverStore(gameStore, archive[0]);
  }
}

const archive = new Archive();
export default archive;
