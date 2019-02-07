import React, { Component } from 'react';
import Progress from 'progressbar.js';
import styled from 'styled-components';

export default class XPCircle extends Component {

  componentDidMount() {
    const XPCircle = new Progress.Circle(`#${this.props.id}`, {
      color: '#FF8C00	',
      strokeWidth: 4 ,
      trailColor: '#414345',
      trailWidth: 3,
      duration: 3000,
      easing: 'easeInOut'
    });
    XPCircle.animate(this.props.percent);
  }

  render() {
    return (
      <div>
        <XP id={this.props.id}></XP>
      </div>
    )
  }
}

const XP = styled.div`
  height: 75%;
  width: 75%;
  margin: 0 auto;
  transform: rotate(180deg);
  background: #232526;
  background: -webkit-radial-gradient(to right, #414345, #232526); 
  background: radial-gradient(to right, #414345, #232526);
  z-index: 0;
  border-radius: 50%;
`;

