import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';

import SimulationSummary from './SimulationSummary';
import SimulationControls from './SimulationControls';
import SimulationOptions from './SimulationOptions';
import { World } from '../simulation';
import PhaserGame from './PhaserGame';

import './Simulation.css';


export default class Simulation extends React.Component {
  constructor (props) {
    super(props)

    let game = PhaserGame(this);

    this.sprites = [];

    // For syncing react with simulation
    const worldState = {
      population: 0,
      spread: 0,
      turn: 0,
      interactions: 0,
    };

    const config = {
      size: {
        x: 6000,
        y: 6000,
      },
      population: 2000,
      tickTime: 300,
    }

    this.state = {
      game,
      worldState,
      playing: false,
      config,
    }

    this.ref = React.createRef();
  }

  componentDidMount() {
    // Construct first world and initialise world state
    this.reset();
  }

  togglePlay = () => {
    if (! this.state.playing && ! this.stepInterval) {
      // Start playing (but ensure we can't make two intervals)
      this.stepInterval = setInterval(() => {
        this.step();
      }, this.state.config.tickTime);
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
    const config = this.state.config;
    this.world = new World({
      population: config.population,
      size: {
        x: config.size.x,
        y: config.size.y,
      },
    });

    this.props.startHistory(config);

    this._syncSimulation();
  }

  _syncSimulation () {
    // Extract details from simulation instance, to update React state,
    // and record events
    const people = this.world.people;
    let worldState = {
      population: people.length,
      spread: people.filter(p => p.value > 0.5).length, // TODO: extract
      interactions: people.filter(p => p.interactedWith).length,
      turn: this.world.turnNumber,
    };

    this.setState((state) => ({
      worldState,
    }));

    this.props.recordHistory(worldState);
  }

  configure = (option, value) => {
    this.setState(state => ({
      config: { ...state.config, [option]: value },
    }));
  }

  render () {
    return (
      <section>
        <div className="flex-across simulation-top">
          <SimulationSummary worldState={this.state.worldState} />
          <SimulationOptions
            configure={this.configure}
            config={this.state.config}
          />
        </div>

        <IonPhaser
          className="game-canvas"
          game={this.state.game}
          initialize={true}
        />

        <SimulationControls
          playing={this.state.playing}
          togglePlay={this.togglePlay}
          step={this.step}
          reset={this.reset}
        />
      </section>
    )
  }
};
