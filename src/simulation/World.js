import Person from './Person';
import * as utils from '../utils'
import Dynamics from './Dynamics';

// TODO-nD: configurable, multidimensional, etc...
const FACTS = 1;

export default class World {
  constructor(config) {
    this.config = {
      personSpeed: 500,
      moveChance: 0.7,
      ...config,
    }

    // Set up dynamics
    this.dynamics = new Dynamics(config);
    this.interactChance = this.dynamics.interactChance();
    this.rapport = this.dynamics.rapport();
    this.argument = this.dynamics.argument(FACTS);
    this.persuasion = this.dynamics.persuasion();
    this.turnNumber = 1;

    this._initialisePopulation(config);
  }

  step () {
    for (let person of this.people) {
      if (utils.roll(this.config.moveChance)) {
        person.move(this.config.personSpeed);
      }

      // select a random person to maybe interact with
      const otherPerson = utils.pick(this.people);
      if (this._willInteract(person, otherPerson)) {
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

  _willInteract(person1, person2) {
    return utils.roll(this.interactChance(person1.distTo(person2)));
  }
};
