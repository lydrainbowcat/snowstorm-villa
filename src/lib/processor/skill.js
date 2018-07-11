import roleStore from "../store/role_store";
import gameStore from "../store/game_store";

const SkillProcessor = {
    judgeRoleHasSkill: function(role, skillName) {
        return role.skills.indexOf(skillName) >= 0;
    },

    addCriminalInvestFeedback: function(role, feedbacks) {
        if (this.judgeRoleHasSkill(role, "criminal_invest") && roleStore.firstCriminalInvestFeedback) {
            roleStore.firstCriminalInvestFeedback = false;
            const motivationStr = gameStore.motivations.map(m => `<${m.title}>`).join();
            feedbacks.push(`动机${motivationStr}`);
        }
    }
};

export default SkillProcessor;
