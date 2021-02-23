import * as utils from '../utils'

const VALUE_BIAS = 0.3;

export default class Person {
  constructor (world) {
    this.worldSize = world.config.size;
    this.pos = utils.randomVector(this.worldSize.x, this.worldSize.y);
    this.value = utils.random();
    this.ideology = utils.random(2) - 1; // TODO: generalise to vector
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
    // When we move, clear any previous interactions
    this.interactedWith = null;
  }

  interact (other) {
    // TODO: generalise to higher dimension using dot product
    // TODO: extract dynamics/analytics equations
    const alignment = this.ideology * other.ideology;
    const rapport = (utils.random(2) - 1 + alignment) / 2;
    const relativeValue = this.value - VALUE_BIAS;
    other.value += rapport * relativeValue;
    other.value = utils.bound(other.value, 0, 1);
    this.interactedWith = {
      other,
      rapport,
    };
  }

  distTo (other) {
    // TODO: maybe optimise? (use distanceSq?)
    return this.pos.distance(other.pos);
  }
};
