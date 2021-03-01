# Memesim

Basic memetics simulator.

Models the spread of a particular subset of beliefs in a population.

A belief may be spread from one person to another if they interact, which depends on a number of factors. The belief status of a person is indicated by their color (red to green).

The position of each person denotes an abstraction of their social and/or ideological situation. The main thing to note at present is proximity affects the chance of two people interacting.

After interacting, people with strong rapport will move towards each other, whereas bad rapport will push them apart.

(However, the dynamics of the simulation are rather simplistic at the moment.)


## Quickstart

Get up and running:

    yarn install
    yarn start

### Testing

Launch test runner:

`yarn test`

### Building

Build for production:

`yarn build`
