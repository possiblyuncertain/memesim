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
      config,
      playing: false,
      resetRequired: false,
    }

    this.ref = React.createRef();
  }

  componentDidMount() {
    // Construct first world and initialise world state
    this.reset();
  }

  togglePlay = () => {
    // TODO: this isn't robust with multiple state updates per render cycle
    if (this.state.playing) {
      this._stopPlay();
    }
    else {
      this._startPlay(this.state.config.tickTime);
    }
  }

  _startPlay(tick) {
    if (this.stepInterval) {
      throw "Step interval already exists";
    }
    this.stepInterval = setInterval(() => {
      this.step();
    }, tick);
    this.setState({ playing: true });
  }

  _stopPlay() {
    if (this.stepInterval) {
      clearInterval(this.stepInterval);
    }
    this.stepInterval = null;
    this.setState({ playing: false });
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
    this.setState({resetRequired: false});
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
    // TODO: Not convinced this is better than separate, per-option
    // configuration functions
    this.setState(state => ({
      config: {
        ...state.config,
        [option]: value,
      },
    }), () => {
      // Then, possibly update running simulation based on config changes.
      // TODO: would it be better to listen for config updates and respond?

      if (option == 'tickTime' && this.state.playing) {
        this._stopPlay();
        this._startPlay(value);
      }

      else if (option == "population" || option == "size") {
        // Requires simulation reset, but might be annoying to force.
        // Instead, we'll let the user know this needs to happen.
        this.setState({resetRequired: true});
      }

    });
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
          highlight={{reset: this.state.resetRequired}}
        />
      </section>
    )
  }
};
