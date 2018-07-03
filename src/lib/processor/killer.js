import CLEWS from "../constants/clew";
import METHODS from "../constants/method";

import gameStore from "../store/game_store";

const KillerProcessor = {
  getAvailableMethods: function() {
    // 在厨房可能得允许拿刀/允许溺水卫生间，这里允许所有手法，可行不可行留作判定
    return METHODS.filter(method => method.name !== gameStore.lastMethodName);
  },

  getAvailableClews: function() {
    const killer = gameStore.killer;
    return CLEWS.filter(clew =>
      killer.clews.indexOf(clew.name) !== -1 && gameStore.usedClewsName.indexOf(clew.name) === -1
    );
  }
};

export default KillerProcessor;
