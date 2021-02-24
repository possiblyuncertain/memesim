import Phaser from 'phaser';

import infected from '../assets/infectedperson.png';
import healthy from '../assets/healthyperson.png';

const SPRITE_SPEED = 0.8;
const MIN_ZOOM = 1/16;
const MAX_ZOOM = 1;

export default function PhaserGame(sim) {

  function preload () {
    // *this* will point to phaser game object
    this.load.image('person', healthy);
    this.load.image('infected', infected);
  };

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

    const mainCamera = this.cameras.main;
    // Center camera on simulation box
    mainCamera.centerOn(
      sim.state.config.size.x/2,
      sim.state.config.size.y/2
    );
    mainCamera.zoom *= 1/4;
    mainCamera.setBackgroundColor('#555555');

    // Input controls for pan and zoom
    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      if (deltaY > 0 && mainCamera.zoom >= MIN_ZOOM) {
        mainCamera.zoom /= 2;
      }
      else if (deltaY < 0 && mainCamera.zoom <= MAX_ZOOM) {
        mainCamera.zoom *= 2;
      }
    });
    this.input.on("pointerdown", pointer => {
      if (pointer.isDown) {
        mainCamera.pan(pointer.worldX, pointer.worldY, 100);
      }
    });
  };

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
  };

  return {
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
