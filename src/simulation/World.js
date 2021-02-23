import Person from './Person';
import * as utils from '../utils'

// The following sets up the world dynamics
// TODO: configurize
const PERSON_SPEED = 500;
const PERSON_MOVE_CHANCE = 0.7;
const PERSON_INTERACT_CHANCE = 0.7;
const PERSON_INTERACT_DIST_SCALING = 300;

function interact_chance(dist) {
  return PERSON_INTERACT_CHANCE * PERSON_INTERACT_DIST_SCALING / dist;
}
function will_interact(person1, person2) {
  return utils.roll(interact_chance(person1.distTo(person2)));
}


export default class World {
  constructor(config) {
    this.config = config;
    this._initialisePopulation(config);
    this.turnNumber = 1;
  }

  step () {
    for (let person of this.people) {
      if (utils.roll(PERSON_MOVE_CHANCE)) {
        person.move(PERSON_SPEED);
      }

      // select a random person to maybe interact with
      const otherPerson = utils.pick(this.people);
      if (will_interact(person, otherPerson)) {
        person.interact(otherPerson);
      }
    }
    this.turnNumber += 1;
  }

  _initialisePopulation (config) {
    this.people = [];
    for (let i=0; i<config.population; i++) {
      this.people.push(new Person(this));
    }
  }
};
