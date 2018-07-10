import { observable, computed } from "mobx";
import dayActionStore from "./day_action_store";

class RoleStore {
  @observable roles = [];
  @observable deadRoles = [];
  @observable firstCriminalInvestFeedback = true; // 法医<刑事侦查>第一次发现尸体

  @computed get count() {
    return this.roles.length;
  }

  addRole(initRole) {
    const role = Object.assign({
      movement: 1,
      location: null,
      fool: false,
      killerTrackActivatable: false
    }, initRole);
    this.roles.push(role);
  }

  getRole(name) {
    const result = this.roles.filter(role => role.name === name);
    return result.length > 0 ? result[0] : null;
  }

  killRole(role) {
    role.location.roles.remove(role);
    role.location.bodies.push(role.title);
    this.deadRoles.push(role);
    this.roles.remove(role);
  }

  renewMovement() {
    this.roles.forEach(role => role.movement = 1);
    dayActionStore.renewMovements();
  }

  clearKillerTrackActivatable() {
    this.roles.forEach(role => role.killerTrackActivatable = false);
  }
}

const roleStore = new RoleStore();
export default roleStore;
