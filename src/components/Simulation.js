import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';

export default class Simulation extends React.Component {
  constructor (props) {
    super(props)
    let phaserConfig = {
      type: Phaser.WEBGL,
      width: props.width,
      height: props.height,
      scene: {
          preload: this.preload,
          create: this.create,
          update: this.update
      },
    };

    this.state = {
      phaserConfig,
    }

    this.ref = React.createRef();
  }

  preload = () => {
  }
  create = () => {
  }
  update = () => {
  }

  render () {
    return <IonPhaser game={this.state.phaserConfig} initialize={false} />;
  }
};
