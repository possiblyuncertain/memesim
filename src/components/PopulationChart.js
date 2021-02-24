import React from 'react';
import * as d3 from 'd3';

import './PopulationChart.css';

export default class PopulationChart extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();

    this.state = {
      turns: 100,
      width: 800,
      height: 200,
    }
  }

  componentDidMount() {
    this.svg = d3.select(this.ref.current)
      .append("svg")
      .attr("width", this.state.width) // TODO: configurize
      .attr("height", this.state.height)
      .attr('transform', d => "scale(1, -1)");
  }

  draw() {
    let turnPixels = this.state.width / this.state.turns;
    let populationPixels = this.state.height / this.props.history[0].population;
    // Scatter points
    this.svg.append('g')
      .selectAll('dot')
      .data(this.props.history)
      .enter()
      .append('circle')
        .attr('cx', d => `${d.turn * turnPixels}`)
        .attr('cy', d => `${d.spread * populationPixels}`)
        .attr('r', 2)
        .style('fill', 'cyan')
  }

  render() {
    if (this.svg) {
      this.draw();
    }

    return <div className="plot" ref={this.ref} />;
  }
};
