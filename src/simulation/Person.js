import * as utils from '../utils'

export default class Person {
  constructor (world) {
    this.worldSize = world.config.size;
    this.pos = utils.randomVector(this.worldSize.x, this.worldSize.y);

    this.attributes = world.dynamics.generatePerson();
    this.world = world;
  }

  move(speed) {
    let move;
    if (this.interactedWith) {
      // Move towards or away from interacted person, depending on rapport
      move = this.interactedWith.other.pos.clone();
      move.subtract(this.pos);
      move.normalize();
      move.scale(speed * this.interactedWith.rapport);
    }
    else {
      move = utils.randomRadialVector(speed);
    }
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
    if (other === this) return;
    const {rapport, argument, persuasion} = this.world;
    let me = this.attributes;
    let you = other.attributes;
    const currentRapport = rapport(me, you);
    const persuaded = persuasion(me, currentRapport, argument(you, me));
    me.belief += (you.belief - me.belief) * persuaded;
    me.belief = utils.bound(me.belief, -1, 1); // TODO: shouldn't be needed
    this.value = me.belief; // TODO: remove?
    this.interactedWith = {
      other,
      rapport: currentRapport,
    };
  }

  distTo (other) {
    // TODO: maybe optimise? (use distanceSq?)
    return this.pos.distance(other.pos);
  }
};
