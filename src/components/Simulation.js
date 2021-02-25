import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';

import SimulationSummary from './SimulationSummary';
import SimulationControls from './SimulationControls';
import PopulationChart from './PopulationChart';
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
      worldHistory : [],
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
    console.log("HISTORY:", this.state.worldHistory);
    const config = this.state.config;
    this.world = new World({
      population: config.population,
      size: {
        x: config.size.x,
        y: config.size.y,
      },
    });

    this._syncSimulation();
  }

  _syncSimulation () {
    const people = this.world.people;
    let worldState = {
      population: people.length,
      spread: people.filter(p => p.value > 0.5).length, // TODO: extract
      interactions: people.filter(p => p.interactedWith).length,
      turn: this.world.turnNumber,
    };
    // TODO: lift up world history?
    this.setState((state) => ({
      worldState,
      worldHistory : [
        // Copy current world state into world history
        {...state.worldState},
        ...state.worldHistory,
      ],
    }));
  }

  configure = (options) => {
    this.setState({
      config: {...options},
    });
  }

  render () {
    return (
      <section>
        <div className="flex-across simulation-top">
          <SimulationSummary worldState={this.state.worldState} />
          <SimulationOptions configure={this.configure} />
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

        <PopulationChart history={this.state.worldHistory}/>
      </section>
    )
  }
};
