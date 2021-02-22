import Person from './Person';

import Phaser from 'phaser';

// TODO: configurize
const PERSON_SPEED = 500;
const PERSON_MOVE_CHANCE = 0.7;

export default class World {
  constructor(config) {
    this.config = config;

    this.rnd = new Phaser.Math.RandomDataGenerator();
    this._initialisePopulation(config);

    this.turnNumber = 1;
  }

  step () {
    for (let person of this.people) {
      if (Math.random() < PERSON_MOVE_CHANCE) {
        this._move(person);
      }
    }
    this.turnNumber += 1;
  }

  _move(person) {
    let [r, theta] = this._random([PERSON_SPEED, 2*Math.PI]);
    let move = new Phaser.Math.Vector2(r, 0);
    move.rotate(theta);
    if (person.pos[0] + move.x < 0
      || person.pos[0] + move.x > this.config.size.x) {
      move.x *= -1;
    }
    if (person.pos[1] + move.y < 0
      || person.pos[1] + move.y > this.config.size.y) {
      move.y *= -1;
    }
    person.pos = person.pos.add(move);
  }

  _initialisePopulation (config) {
    this.people = [];
    for (let i=0; i<config.population; i++) {
      let pos = this._random([this.config.size.x, this.config.size.y]);
      this.people.push({
        pos: new Phaser.Math.Vector2(...pos),
      });
    }
  }

  _random (limits) {
    return limits.map(limit => this.rnd.realInRange(0, limit));
  }
};
