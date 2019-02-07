import React, { Component } from 'react';
import Progress from 'progressbar.js';
import styled from 'styled-components';

export default class XPCircle extends Component {

  componentDidMount() {
    const XPCircle = new Progress.Circle(`#${this.props.id}`, {
      color: '#ff0000',
      strokeWidth: 3 ,
      trailColor: '#eeeeee',
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
  height: 90%;
  width: 90%;
  margin: 0 auto;
`;

