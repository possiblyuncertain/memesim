import Phaser from 'phaser';

const Vec2 = Phaser.Math.Vector2;
const Rnd = new Phaser.Math.RandomDataGenerator();

function random (limit) {
  return Rnd.realInRange(0, limit !== undefined ? limit : 1);
}

function randomArray (limits) {
  return limits.map(limit => random(limit));
}

function randomVector (x, y) {
  return new Vec2(random(x), random(y));
}

function randomRadialVector (radius) {
  const [r, theta] = randomArray([radius, 2*Math.PI]);
  let v = new Phaser.Math.Vector2(r, 0);
  v.rotate(theta);
  return v;
}

export {
  Vec2,
  random,
  randomArray,
  randomVector,
  randomRadialVector,
};
