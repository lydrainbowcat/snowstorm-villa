import CLEWS from "../constants/clew";
import METHODS from "../constants/method";
import Utils from "../utils";

import gameStore from "../store/game_store";
import nightActionStore from "../store/night_action_store";
import roleStore from "../store/role_store";

const KillerProcessor = {
  setMotivation: function(motivation, type, detail) {
    gameStore.setMotivation(motivation);
    let log = `凶手选择了动机<${gameStore.motivation.title}>`;
    if (motivation === "premeditation") {
      log += `，预谋${type === "method" ? "手法" : "线索"}为<${detail.title}>`;
      // 把预谋手法或线索加入凶手人物模板
      if (type === "method") gameStore.killer.methods.push(detail.name);
      else gameStore.killer.clews.push(detail.name);
    }
    return log;
  },

  getAvailableMethods: function() {
    // 在厨房可能得允许拿刀/允许溺水卫生间，这里允许所有手法，可行不可行留作判定
    return METHODS.filter(method => method.name !== gameStore.lastMethodName);
  },

  getAvailableClews: function() {
    const killer = gameStore.killer;
    return CLEWS.filter(clew =>
      killer.clews.indexOf(clew.name) !== -1 && gameStore.usedClewsName.indexOf(clew.name) === -1
    );
  },

  validateKilling: function() {
    const {targetType, targetRole, targetPlace, method, clew, trickMethod, trickClew} = nightActionStore;
    const killer = gameStore.killer;
    const killerLocation = killer.location;

    if (targetType === "role" && targetRole === null) return "未设定谋杀死者";
    if (targetType === "place" && targetPlace === null) return "未设定群杀地点";
    if (method === null) return "未设定杀人手法";
    if (clew === null) return "未设定遗留线索";
    if (trickMethod === null) return "未设定诡计手法";
    if (trickClew === null) return "未设定诡计线索";
    if (targetType === "place" && targetPlace.name === "garden" && method.name !== "trap")
      return "不能非陷阱方式群杀花园";
    if (method.name === "drown" && (targetType !== "place" || targetPlace.name !== "toilet"))
      return "不能溺水杀卫生间以外的地方";
    if (method.name !== "drown" && killer.methods.indexOf(method.name) === -1 &&
        !((method.name === "blade" || method.name === "strangle") && killerLocation.name === "kitchen"))
      return "人物模版没有选定的杀人手法";

    return null;
  },

  actKilling: function() {
    const {targetType, targetRole, targetPlace, method, clew, trickMethod, trickClew} = nightActionStore;
    const killer = gameStore.killer;
    const killerLocation = killer.location;

    gameStore.lastMethodName = method.name;
    gameStore.usedClewsName.push(clew.name);

    // 执行杀人判定
    let deadLocation = null;
    let logText = killer.title;
    let deadNameList = [];

    if (targetType === "role") {
      logText += `<点杀>${targetRole.title}，`;
      deadLocation = targetRole.location;
      if (deadLocation.name !== "cellar") { // 地下室的人无法被点杀
        roleStore.killRole(targetRole);
        deadNameList.push(targetRole.title);
      }
    } else {
      logText += `<群杀>${targetPlace.title}，`;
      deadLocation = targetPlace;
      targetPlace.roles.forEach(role => {
        roleStore.killRole(role);
        deadNameList.push(role.title);
      });
      Utils.shuffleArray(deadLocation.bodies);
    }

    logText += `线索为<${method.title}><${clew.title}>，诡计为<${trickMethod.title}><${trickClew.title}>，`;
    if (deadNameList.length > 0) {
      logText += "死者有：" + deadNameList.join("，") + "。";
      deadLocation.method = method;
      deadLocation.clew = clew;
      deadLocation.trickMethod = trickMethod;
      deadLocation.trickClew = trickClew;
      nightActionStore.setCanJoviality(true);
      gameStore.someoneKilled = true;
    } else {
      logText += `行凶失败。`;
      deadLocation.extraClews.push(clew.title);
      nightActionStore.setCanJoviality(false);

      //凶手行踪已激活时，若凶手行凶失败、未在花园过夜且过夜地点有受困者存活，提醒凶手行踪
      nightActionStore.killerTrack = gameStore.killerTrackActive &&
        killerLocation.name !== "garden" && killerLocation.roles.length > 1;
    }

    if (killerLocation.name === "kitchen") { // 凶手在厨房过夜，案发地会留下零食
      deadLocation.extraClews.push(CLEWS.filter(clew => clew.name === "snack")[0].title);
    }
    if (killerLocation.name === "garden") { // 凶手在花园过夜，案发地会留下泥土
      deadLocation.extraClews.push(CLEWS.filter(clew => clew.name === "soil")[0].title);
    }

    if (deadLocation.extraClews.length > 0) {
      deadLocation.extraClews = Utils.uniqueArray(deadLocation.extraClews);
      Utils.shuffleArray(deadLocation.extraClews);
      logText += `${deadLocation.title}留下额外线索<${deadLocation.extraClews.join(" ")}>。`;
    }

    return logText;
  }
};

export default KillerProcessor;
