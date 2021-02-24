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
      margin: {x: 40, y: 20},
    }
  }

  componentDidMount() {
    this.svg = d3.select(this.ref.current)
      .append("svg")
      .attr("width", this.state.width) // TODO: configurize
      .attr("height", this.state.height + 2 * this.state.margin.y);
  }

  draw() {
    const { width, height, margin, turns } = this.state;
    const pop = this.props.history[0].population;
    const turnPixels = width / turns;
    const populationPixels = height / pop;

    // Scatter points
    this.svg.append('g')
      .attr('transform', d => `translate(${margin.x}, ${margin.y})`)
      .selectAll('dot')
      .data(this.props.history)
      .enter()
      .append('circle')
        .attr('cx', d => `${d.turn * width / turns}`)
        .attr('cy', d => `${height - d.spread * (height / pop)}`)
        .attr('r', 2)
        .style('fill', 'blue')

    // X-axis
    let xScale = d3.scaleLinear()
      .domain([0, turns])
      .range([0, width]);
    this.svg.append('g')
      .attr('transform', d => `translate(${margin.x}, ${height+margin.y})`)
      .call(d3.axisBottom(xScale));

    // Y-axis
    let yScale = d3.scaleLinear()
      .domain([0, this.props.history[0].population]).nice()
      .range([height, 0]);
    this.svg.append('g')
      .attr('transform', d => `translate(${margin.x}, ${margin.y})`)
      .call(d3.axisLeft(yScale));
  }

  render() {
    if (this.svg) {
      this.draw();
    }

    return <div className="plot" ref={this.ref} />;
  }
};
