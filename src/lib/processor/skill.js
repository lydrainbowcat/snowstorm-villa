import roleStore from "../store/role_store";
import gameStore from "../store/game_store";

const SkillProcessor = {
    // 灵巧（无视地形人数上限）
    isDexterous: function(role) {
        return role.name === "high_school_student";
    },

    // 刑事侦查
    hasCriminalInvestigation: function(role) {
        return role.name === "forensic_doctor";
    },

    addCriminalInvestFeedback: function(feedbacks) {
        if (roleStore.firstCriminalInvestFeedback) {
            roleStore.firstCriminalInvestFeedback = false;
            const motivationStr = gameStore.motivations.map(m => `<${m.title}>`).join();
            feedbacks.push(`动机${motivationStr}`);
        }
    }
};

export default SkillProcessor;
