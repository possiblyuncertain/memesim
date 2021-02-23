import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';

import SimulationSummary from './SimulationSummary';
import SimulationControls from './SimulationControls';
import { World } from '../simulation';

import '../styles.scss';
import './Simulation.css';

import infected from '../assets/infectedperson.png';
import healthy from '../assets/healthyperson.png';


const SPRITE_SPEED = 0.8;

export default class Simulation extends React.Component {
  constructor (props) {
    super(props)

    function preload () {
      // *this* will point to phaser game object
      this.load.image('person', healthy);
      this.load.image('infected', infected);
      this.cameras.main.zoom *= 1/2;
      this.cameras.main.setBackgroundColor('#555555');
    }

    // scene callbacks need *this* to be phaser game object
    let sim = this;
    function create () {
      // Add bounding box
      const {x, y} = sim.world.config.size;
      const padding = 250;
      const box = this.add.rectangle(x/2, y/2, x+padding, y+padding, 0x444455);
      box.setStrokeStyle(3, 0x222222);
      // Add person sprites
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
        let sprite = sim.sprites[i]

        // *Slide* sprite into new position
        let newPos = person.pos.clone();
        newPos.lerp(sprite.getCenter(), SPRITE_SPEED);
        sprite.setPosition(newPos.x, newPos.y);

        // Interpolate sprite tint color based on person values
        // TODO: Would be better to set up using a stylesheet
        //       ideally a gradient?
        const color = Phaser.Display.Color.GetColor(
          255 * (1 - person.value),
          255 * person.value,
          0,
        );
        sprite.setTint(color);

        // Order sprites based on vertical pos
        sprite.setDepth(newPos.y);
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
      <section>
        <SimulationSummary worldState={this.state.worldState} />
        <SimulationControls
          playing={this.state.playing}
          togglePlay={this.togglePlay}
          step={this.step}
          reset={this.reset}
        />
        <IonPhaser className="game-canvas" game={this.state.game} initialize={true} />
      </section>
    )
  }
};
