/*
 * *PhaserGame* is a wrapper class to provide an interface between React and
 * the phaser game instance.
 *
 * NOTE: Phaser is largely designed to handle itself independently and
 * autonomously, whereas we are using it as a controlled component. This
 * class provides the interface to do so.
 */

import Phaser from 'phaser';

import infected from '../assets/infectedperson.png';
import healthy from '../assets/healthyperson.png';

const SPRITE_SPEED = 0.8;
const MIN_ZOOM = 1/16;
const MAX_ZOOM = 1;

// TODO: configurise
const colors = {
  background: 0x555555,
  boxStroke: 0x222222,
  boxFill: 0x444455,
};

export default class PhaserGame {
  constructor (sim) {
    this.sim = sim;
    this.sprites = null;
    const controller = this;

    function preload () {
      // *this* will point to phaser game object
      console.debug("Preloading Phaser game...");
      this.load.image('person', healthy);
      controller.game = this;
      controller.mainCamera = this.cameras.main;
    };

    function create () {
      console.debug("Creating Phaser game...");

      // Add person sprites
      controller.reset();

      // Input controls for pan and zoom
      this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        if (deltaY > 0 && controller.mainCamera.zoom >= MIN_ZOOM) {
          controller.mainCamera.zoom /= 2;
        }
        else if (deltaY < 0 && controller.mainCamera.zoom <= MAX_ZOOM) {
          controller.mainCamera.zoom *= 2;
        }
      });
      this.input.on("pointerdown", pointer => {
        if (pointer.isDown) {
          controller.mainCamera.pan(pointer.worldX, pointer.worldY, 100);
        }
      });
    };

    function update () {
      // *this* will point to phaser game object
      const sprites = controller.sprites.getChildren();
      for (const [i, person] of controller.sim.world.people.entries()) {
        let sprite = sprites[i];

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
        sprite.setTint('blue');

        // Order sprites based on vertical pos
        sprite.setDepth(newPos.y);
      }
    };

    this.gameConfig = {
      type: Phaser.AUTO,
      width: 800,//sim.props.width,
      height: 800,//sim.props.height,
      scene: {
        preload,
        create,
        update,
      },
    };
  }

  reset () {
    const {x, y} = this.sim.world.config.size;

    // Add person sprites
    if (! this.game) return;
    if (this.sprites) {
      this.sprites.destroy(true);
    }
    this.sprites = this.game.add.group();

    for (const person of this.sim.world.people) {
      let newSprite = this.game.add.image(
        person.pos[0],
        person.pos[1],
        'person',
      );
      this.sprites.add(newSprite);
    }

    // Add bounding box
    const padding = 250;
    if (this.box) {
      this.box.destroy();
    }
    this.box = this.game.add.rectangle(x/2, y/2, x+padding, y+padding, colors.boxFill);
    this.box.setStrokeStyle(3, colors.boxStroke);

    // Center camera on simulation box
    this.mainCamera.centerOn(x/2, y/2);
    this.mainCamera.zoom = 1/4;
    this.mainCamera.setBackgroundColor(colors.background);
  }
};
