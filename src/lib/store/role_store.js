import { observable, computed } from "mobx";
import ENUM from "../constants/enum";
import dayActionStore from "./day_action_store";
import gameStore from "./game_store";

class RoleStore {
  protos = {
    value: ["name", "title", "keen", "inference", "fierce", "movement", "location", "fool",
            "killerTrackActivatable", "suspicious", "suppressed"],
    array: ["methods", "clews", "skills", "usedLimitedSkills"],
    map: []
  };

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
    role.usedLimitedSkills.clear(); // 恢复限定技，以备灵媒<降灵>
    gameStore.overtimeUsed = -2; // 恢复上次加班日期，以备灵媒立刻<加班>
    if (role.name === ENUM.ROLE.PROPSMAN) { // 灵媒<降灵>不能使用道具师的道具
      role.usedLimitedSkills.push(ENUM.SKILL.PROPSMAN_SHOW_MECHANISM);
      role.usedLimitedSkills.push(ENUM.SKILL.PROPSMAN_SHOW_TOY_CAR);
      role.usedLimitedSkills.push(ENUM.SKILL.PROPSMAN_SHOW_FRIGHTEN);
      role.usedLimitedSkills.push(ENUM.SKILL.PROPSMAN_SHOW_DOLL);
    }
  }

  renewMovement() {
    this.roles.forEach(role => role.movement = 1);
    dayActionStore.renewMovements();
  }

  clearKillerTrackActivatable() {
    this.roles.forEach(role => role.killerTrackActivatable = false);
  }

  clearSuppressed() {
    this.roles.forEach(role => role.suppressed = false);
  }
}

const roleStore = new RoleStore();
export default roleStore;
