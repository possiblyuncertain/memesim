import * as utils from '../utils'

export default class Person {
  constructor (world) {
    this.worldSize = world.config.size;
    this.pos = utils.randomVector(this.worldSize.x, this.worldSize.y);
    this.value = utils.random();
  }

  move(speed) {
    let move = utils.randomRadialVector(speed)
    this.pos.add(move);
    // If out of bounds, reflect move about offending axis
    if (this.pos.x < 0 || this.pos.x > this.worldSize.x) {
      this.pos.x += -2 * move.x;
    }
    if (this.pos.y < 0 || this.pos.y > this.worldSize.y) {
      this.pos.y += -2 * move.y;
    }
  }
};
