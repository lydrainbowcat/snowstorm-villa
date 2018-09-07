import { observable, computed } from "mobx";
import dayActionStore from "./day_action_store";

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
      fool: false,
      killerTrackActivatable: false,
      usedLimitedSkills: [],
      suspicious: false, // 被刑侦，技能失效
      suppressed: false // 被镇压，非锁定技失效
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
