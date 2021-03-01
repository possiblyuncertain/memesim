/*
 * Describes the dynamics for the interaction of persons in the simulation,
 * and the consequent evolution of belief systems.
 *
 * This class is a factory to provide dynamical functions with a parameter
 * context baked in, while still maintaining flexibility and modularity.
 * This is why every function returns a function, and why we precompute
 * every function needed by other functions.
 *
 * This kind of optimisation is probably going to be negligible in
 * javascipt. However, this design should better allow incorporating
 * precompiled elements (maybe webassembly or shader programs etc).
 */

// TODO-nD: Generalise to multi-dimensional belief systems.
//  This will involve generalising certain personal attributes
//  (eg personality, beliefs) to vectors, and using dot products etc.
//  We need this to be able to model complicated belief systems etc.

// TODO: Currently, we need to track the magnitude of different random
//  variables manually in order to normalise them correctly etc. It would
//  be better to construct a *RandomVariable* class (or find one) for each
//  attribute, that can create its own function for
//  distribution/varying/weighting etc.

// TODO: Dynamics functions at present are rather simplistic, they capture
//  some basic causality (still useful), but are quantitatively naive. Need
//  to provide a suite of maths functions for transforming and mixing
//  variables, ideally in a configurable way. For example, we could pass a
//  scaling function to *alignment* and a mixing function to *rapport*.

// TODO: Add a bit more variance

import * as utils from '../utils';


// Some utility functions...
const weighted2 = (x1, w1, x2, w2) => (w1 * x1 + w2 * x2) / (w1 + w2);

const central = utils.centralDistribution();

function createVaryFunc(variance=1, magnitude=1) {
  // Returned function varies and renormalises given amount
  const scaling = magnitude / (magnitude + variance);
  return (amount) => scaling * (amount + variance * central());
}

const vary = createVaryFunc();


export default class Dynamics {

  constructor(config) {

    // TODO: The flat distribution is basically the same as the central
    //  distribution for n=1 now, generalise that way...
    this.config = {
      // Chance of interaction
      interactChance: 0.8,
      interactDistScaling: 1000,

      // Social
      personality: { peak: 0, width: 1 },
      valuesPersonality: { from: 0, to: 1},
      group: { choose: [0, 1] }, 
      valuesGroup: { from: 0, to: 1}, // Essentially tribalism

      // Beliefs
      belief: { peak: 0, width: 1 },

      // Argument
      reasonableness: { from: 0, to: 1 },
      rationality: { from: 0, to: 1 },
      rhetoric: { from: 0, to: 1},

      ...config,
    };

    this.generatePerson = this._createDistributions([
      'personality',
      'valuesPersonality',
      'group',
      'valuesGroup',
      'belief',
      'reasonableness',
      'rationality',
      'rhetoric',
    ]);
  }

  _createDistributions(attributes) {
    let distributionFuncs = attributes.map(attr => {
      const params = this.config[attr];
      if ('peak' in params && 'width' in params) {
        return [attr, utils.centralDistribution(params)];
      }
      else if ('from' in params && 'to' in params) {
        return [attr, utils.flatDistribution(params)];
      } else if ('choose' in params) {
        return [attr, utils.discreteDistribution(params.choose)];
      } else {
        throw new Error(`Unknown distribution definition ${JSON.stringify(attr)}: ${JSON.stringify(params)}`);
      }
    });

    return function generate() {
      return Object.fromEntries(distributionFuncs.map(([attr, func]) => {
        return [attr, func()];
      }));
    }
  }

  // Note: currently using a uniform probability to select other persons for
  // potential interaction
  interactChance() {
    const base = this.config.interactChance;
    const scaling = this.config.interactDistScaling;

    return (dist) => base * scaling / dist;
  }

  alignment() {
    return (p1, p2) => vary(p1.personality * p2.personality);
  }

  solidarity() {
    return (p1, p2) => (p1.group == p2.group) ? 1: -1;
  }

  rapport() {
    const alignment = this.alignment();
    const solidarity = this.solidarity();
    return function (person, other) {
      return weighted2(
        alignment(person, other), person.valuesPersonality,
        solidarity(person, other), person.valuesGroup,
      );
    };
  }

  validArguments(facts) {
    // TODO-nD: person.beliefs.dot(facts)
    //  alignment of personal beliefs and reality
    return person => person.belief * facts * person.rationality;
  }
  invalidArguments() {
    return person => person.rhetoric * (1 - person.reasonableness);
  }
  /*
   * Return a function that determines the strength of an argument
   * (regarding certain *facts*) as perceived by the other person.
   */
  argument(facts) {
    const goodPoints = this.validArguments(facts);
    const badPoints = this.invalidArguments();
    return function (person, other) {
      return goodPoints(person) * other.rationality
        + badPoints(person) * (1 - other.rationality);
    };
  }

  receptiveness() {
    return function (person, rapport) {
      return person.reasonableness + (1 - person.reasonableness) * rapport;
    }
  }

  persuasion() {
    const receptiveness = this.receptiveness();
    return function (person, rapport, argument) {
      return receptiveness(person, rapport) * argument;
    };
  }
}
