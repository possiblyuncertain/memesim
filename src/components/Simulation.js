import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';

import '../styles.scss';

import infected from '../assets/infectedperson.png';
import healthy from '../assets/healthyperson.png';

import SimulationSummary from './SimulationSummary';
import SimulationControls from './SimulationControls';

import { World } from '../simulation';

const SPRITE_SPEED = 0.8;

export default class Simulation extends React.Component {
  constructor (props) {
    super(props)

    function preload () {
      // *this* will point to phaser game object
      this.load.image('person', healthy);
      this.load.image('infected', infected);
      this.cameras.main.setBackgroundColor('#bbbbbb');
      this.cameras.main.zoom *= 1/4;
    }

    // scene callbacks need *this* to be phaser game object
    let sim = this;
    function create () {
      for (const person of sim.world.people) {
        let newSprite = this.add.image(
          person.pos[0],
          person.pos[1],
          'person',
        );
        sim.sprites.push(newSprite);
      }
    }

    function update () {
      // *this* will point to phaser game object
      // *sim* refers to the current *Simulation* instance
      for (const [i, person] of sim.world.people.entries()) {
        let newPos = person.pos.clone();
        newPos.lerp(sim.sprites[i].getCenter(), SPRITE_SPEED);
        sim.sprites[i].setPosition(newPos.x, newPos.y);
      }
    }

    let game = {
      type: Phaser.AUTO,
      width: props.width,
      height: props.height,
      scene: {
        preload,
        create,
        update,
      },
    };

    this.sprites = [];

    // For syncing react with simulation
    let worldState = {
      population: 0,
      spread: 0,
      turn: 0,
    };

    this.state = {
      game,
      worldState,
      worldHistory : [],
      playing: false,
    }

    // Construct first world and initialise world state
    this.reset();

    this.ref = React.createRef();
  }

  togglePlay = () => {
    if (! this.state.playing && ! this.stepInterval) {
      // Start playing (but ensure we can't make two intervals)
      this.stepInterval = setInterval(() => {
        this.step();
      }, this.props.tick || 500);
    }
    else {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
    }
    this.setState((state, props) => ({
      playing: ! state.playing,
    }));
  }

  step = () => {
    this.world.step();
    this._syncSimulation();
  }

  reset = () => {
    //TODO: configurize
    this.world = new World({
      population: 50,
      size: {
        x: 1000,
        y: 1000,
      },
    });

    this._syncSimulation();
  }

  _syncSimulation () {
    let worldState = {
      population: this.world.people.length,
      spread: this.world.people.length,
      turn: this.world.turnNumber,
    };
    this.setState((state) => ({
      worldState,
      worldHistory : [
        state.worldState,
        ...state.worldHistory,
      ],
    }));
  }

  render () {
    return (
      <>
        <SimulationSummary worldState={this.state.worldState} />
        <SimulationControls
          playing={this.state.playing}
          togglePlay={this.togglePlay}
          step={this.step}
          reset={this.reset}
        />
        <IonPhaser game={this.state.game} initialize={true} />
      </>
    )
  }
};
