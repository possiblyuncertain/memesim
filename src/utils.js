import Phaser from 'phaser';

const Vec2 = Phaser.Math.Vector2;
const Rnd = new Phaser.Math.RandomDataGenerator();

function random (limit) {
  return Rnd.realInRange(0, limit !== undefined ? limit : 1);
}

// Rnd.pick doesn't work here :(
function pick (array) {
  return array[Math.floor(random(array.length))];
}

function roll (chance, callback, ...args) {
  if (random() < chance) {
    if (callback) {
      callback(...args);
    }
    return true;
  }
  return false;
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

function centralDistribution (params={ peak: 0, width: 1 }, n=2) {
  // This provides a crude approximation of a normal distribution,
  // calculated using n uniform random samples.
  const die = 2 * params.width / n;
  const min = params.peak - params.width;
  if (n === 2) {
    // Hardcode most likely case
    return function () {
      return min + die * (Math.random() + Math.random());
    }
  }
  return function () {
    for (var total=0, i=0; i<n; i++) total += Math.random();
    return min + die * total;
  };
}

function flatDistribution (params) {
  const min = params.from;
  const range = params.to - params.from;
  return function () {
    return min + Math.random() * range;
  };
}

function discreteDistribution (params=[0, 1]) {
  const len = params.length;
  return () => params[Math.floor(Math.random() * len)];
}

function bound(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function capitalise(str) {
  return str.split(' ')
    .map(substr => substr[0].toUpperCase() + substr.slice(1))
    .join(' ');
}

export {
  Vec2,
  random,
  roll,
  pick,
  randomArray,
  randomVector,
  randomRadialVector,
  centralDistribution,
  flatDistribution,
  discreteDistribution,
  bound,
  capitalise,
};
