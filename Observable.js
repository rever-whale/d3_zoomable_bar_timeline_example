const list = {};

class Observable {
  static subscribe (key, callback) {
    if (list[key]) {
      list[key].push(callback);
    } else {
      list[key] = [callback];
    }
  }

  static publish (key, ...args) {
    if (list[key]) {
      list[key].forEach(callback => callback(...args));
    }
  }
}
