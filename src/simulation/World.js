import Person from './Person';
import * as utils from '../utils'

// TODO: configurize
const PERSON_SPEED = 500;
const PERSON_MOVE_CHANCE = 0.7;

export default class World {
  constructor(config) {
    this.config = config;
    this._initialisePopulation(config);
    this.turnNumber = 1;
  }

  step () {
    for (let person of this.people) {
      if (utils.random() < PERSON_MOVE_CHANCE) {
        person.move(PERSON_SPEED);
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
