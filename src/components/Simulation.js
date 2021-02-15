import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';

import infected from '../assets/infectedperson.png';
import healthy from '../assets/healthyperson.png';

export default class Simulation extends React.Component {
  constructor (props) {
    super(props)

    function preload () {
      // *this* will point to phaser game object
      this.load.image('person', healthy);
      this.load.image('infected', infected);
      this.cameras.main.setBackgroundColor('#bbbbbb');
    }

    function create () {
      // *this* will point to phaser game object
      this.add.image(400, 200, 'person');
      this.add.image(400, 600, 'infected');
    }

    function update () {
      // *this* will point to phaser game object
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

    this.state = {
      game,
    }

    this.ref = React.createRef();
  }

  render () {
    return <IonPhaser game={this.state.game} initialize={true} />;
  }
};
