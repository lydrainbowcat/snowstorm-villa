import { observable, computed } from "mobx";

class RoleStore {
  @observable roles = [];
  @observable deadRoles = [];

  @computed get count() {
    return this.roles.length;
  }

  addRole(initRole) {
    const role = Object.assign({
      movement: 1,
      location: null,
      fool: false
    }, initRole);
    this.roles.push(role);
  }

  getRole(name) {
    const result = this.roles.filter(role => role.name === name);
    return result.length > 0 ? result[0] : null;
  }

  killRole(role) {
    this.deadRoles.push(role);
    this.roles.remove(role);
  }

  renewMovement() {
    this.roles.forEach(role => role.movement = 1);
  }
}

const roleStore = new RoleStore();
export default roleStore;
