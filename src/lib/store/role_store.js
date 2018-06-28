import { observable, computed } from "mobx";

class RoleStore {
  @observable roles = [];

  @computed get count() {
    return this.roles.length;
  }

  @computed get aliveCount() {
    return this.roles.filter(role => role.alive).length;
  }

  addRole(initRole) {
    const role = Object.assign({
      alive: true,
      movement: 1,
      location: null
    }, initRole);
    this.roles.push(role);
  }

  getPlace(name) {
    const result = this.roles.filter(role => role.name === name);
    return result.length > 0 ? result[0] : null;
  }
}

const roleStore = new RoleStore();
export default roleStore;
