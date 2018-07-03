const Utils = {
  shuffleArray: function(arr) {
    let i = arr.length;
    let j = 0;
    while (i) {
      j = Math.floor(Math.random() * i--);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  },

  uniqueArray: function(arr) {
    return arr.filter((x, i) => arr.indexOf(x) === i);
  },

  randInt: function(n) {
    return Math.floor(Math.random() * n);
  },

  randElement: function (arr) {
    return arr[Utils.randInt(arr.length)];
  },

  randElementExceptIn: function(arr, exceptList) {
    let index = null;
    do {
      index = Utils.randInt(arr.length);
    } while (exceptList.indexOf(arr[index]) !== -1);
    return arr[index];
  },

  randElementExceptNameIn: function(arr, exceptList) {
    let index = null;
    do {
      index = Utils.randInt(arr.length);
    } while (exceptList.indexOf(arr[index].name) !== -1);
    return arr[index];
  }
};

export default Utils;
