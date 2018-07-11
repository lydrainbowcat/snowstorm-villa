import roleStore from "../store/role_store";
import gameStore from "../store/game_store";
import logStore from "../store/log_store";
import CLEWS from "../constants/clew";
import SKILLS from "../constants/skill";

const SkillProcessor = {
  getSkill: function(skillName) {
    const result = SKILLS.filter(s => s.name === skillName);
    return result.length > 0 ? result[0] : null;
  },

  judgeRoleHasSkill: function(role, skillName) {
    if (role.skills.indexOf(skillName) < 0) return false; // 无此技能
    const skill = this.getSkill(skillName);
    if (skill.type === 2 && role.usedLimitedSkills.indexOf(skillName) >= 0) return false; // 已用过的限定技
    return true;
  },

  addCriminalInvestFeedback: function(role, feedbacks) {
    if (this.judgeRoleHasSkill(role, "criminal_invest") && roleStore.firstCriminalInvestFeedback) {
      roleStore.firstCriminalInvestFeedback = false;
      const motivationStr = gameStore.motivations.map(m => `<${m.title}>`).join("");
      feedbacks.push(`动机${motivationStr}`);
    }
  },

  addPerfumeExtraClew: function(perfumeTarget) {
    perfumeTarget.extraClews.push(CLEWS.filter(clew => clew.name === "smell")[0].title);
    gameStore.killer.location.extraClews.push(CLEWS.filter(clew => clew.name === "smell")[0].title);
    logStore.addLog(`女医生<香水>在${perfumeTarget.title}和${gameStore.killer.location.title}产生了额外线索<痕迹：气味>`);
    roleStore.perfumeActive = false;
  },

  struggleToPlace: function(dst) {
    const src = roleStore.struggleFrom;
    dst.bodies.push("猎人");
    dst.method = src.method;
    dst.clew = src.clew;
    dst.trickMethod = src.trickMethod;
    dst.trickClew = src.trickClew;
    src.bodies.remove("猎人");
    if (src.bodies.length === 0) {
      src.method = src.clew = src.trickMethod = src.trickClew = null;
    }
    logStore.addLog(`猎人<求生本能>把尸体从${src.title}转移到${dst.title}`);
    roleStore.struggleFrom = null;
  }
};

export default SkillProcessor;
