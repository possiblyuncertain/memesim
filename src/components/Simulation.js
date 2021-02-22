import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';

import '../styles.scss';

import infected from '../assets/infectedperson.png';
import healthy from '../assets/healthyperson.png';

import SimulationSummary from './SimulationSummary';
import SimulationControls from './SimulationControls';

import { World } from '../simulation';

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
        let newPos = person.pos.lerp(sim.sprites[i].getCenter(), 0.3);
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

    this.world = new World({
      population: 20,
      size: {
        x: 1000,
        y: 1000,
      },
    });

    this.sprites = [];

    // For syncing react with simulation
    let worldState = {
      population: this.world.people.length,
      spread: this.world.people.length,
      turn: 0,
    };

    this.state = {
      game,
      worldState,
    }

    this.ref = React.createRef();
  }

  togglePlay = () => {
    this.setState((state, props) => ({
      playing: ! state.playing,
    }));
  }

  stepForward = () => {
    this.world.step();
    this._syncSimulation();
  }

  reset = () => {
    alert("RESET");
    this._syncSimulation();
  }

  _syncSimulation () {
    this.setState({
      worldState: {
        population: this.world.people.length,
        spread: this.world.people.length,
        turn: this.world.turnNumber,
      }
    });
  }

  render () {
    return (
      <>
        <SimulationSummary worldState={this.state.worldState} />
        <SimulationControls
          playing={this.state.playing}
          togglePlay={this.togglePlay}
          stepForward={this.stepForward}
          reset={this.reset}
        />
        <IonPhaser game={this.state.game} initialize={true} />
      </>
    )
  }
};
