import React, { Component } from 'react';
import axios from 'axios';
import skillIndex from './skills';
import styled from 'styled-components';
import XPCircle from './components/XPCircle';

class App extends Component {

  // setting the default state to null.
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      images: null,
      xpIndex: null,
    }
  }

  // import images takes a regexp as a parameter...
  importAllImages(r) {
    // returns one object
    let images = {};

    // basically, dissect the regexp to add the image to the images object.
    r.keys().map((item, index) => {
      images[item.replace('./', '')] = r(item); 
    });

    return images;

  }

  // lets make this once and never touch it again. Here we go.
  createXPLevelArray() {
    const arr = [];
    arr.push("PAD");
    arr.push("PAD");

    let points = 0;
    let output = 0;
    const maxLevel = 120;

    for (let level = 1; level <= maxLevel; level++) {
      points += Math.floor(level + 300 * Math.pow(2, level / 7.));
      output = Math.floor(points / 4);

      arr.push({
        level: level + 1,
        xpRequired: output,
      });
    }

    return arr;
  }

  // calculates the percentage XP earned for the next level.
  calculatePercentage(levelXP, nextLevelXP, currentXP) {

    // basically, we need to do some mutations with the raw data because the API is stupid and it makes NO SENSE. 
    const amountInLevel = nextLevelXP - levelXP;
    const amountAdvanced = Math.floor(currentXP / 10) - levelXP;
    const percent = amountAdvanced / amountInLevel;

    if (levelXP === undefined) return 0;
    else return percent;
  }

  // mount hook is getting data from our API call and rendering it to the page. 
  componentDidMount() {

    // importing all skill images from their directory.
    const images = this.importAllImages(require.context('./assets', false, /\.(png|jpe?g|svg)$/));

    const url = 'https://cors-anywhere.herokuapp.com/https://apps.runescape.com/runemetrics/profile/profile?user=%22sala%20san%22';

    axios.get(url)
      .then(res => {
        // and here, setting both images and data on page load.
        this.setState({
          data: res.data,
          images: images
        })
      })
      .catch(error => {
        console.log(error);
      });

    this.setState({
      xpIndex: this.createXPLevelArray()
    });
  }
  render() {

    const SkillStats = () => {      
      return this.state.data.skillvalues.map(skill => 
        <Skill key={ skill.id }>

          <h4>{ skillIndex[skill.id].name }</h4>

          <img src={ this.state.images[`${skillIndex[skill.id].name}-icon.png`] } alt="skill logo"/>

          <p>Level :{ skill.level }</p>

          <p>XP: { Math.floor(skill.xp / 10) }</p>

          {/* Next level is a calculation of the xp required for the level at the next index from current level. */}
          <p>Next Level: { this.state.xpIndex[skill.level + 1].xpRequired - Math.floor(skill.xp / 10) }</p>

          <XPCircle 

// calculatePercentage(levelXP, nextLevelXP, currentXP) {

            percent={ this.calculatePercentage(
              this.state.xpIndex[skill.level].xpRequired,
              this.state.xpIndex[skill.level + 1].xpRequired,
              skill.xp 
            )} 
            id={skillIndex[skill.id].name} 
          />
        </Skill>
      );
    }
    // conditional render: need to wait until AXIOS request resolves before trying to pour data onto the page.
    const DidGetData = () => {
      if (this.state.data) {
        return <div>
            Welcome, { this.state.data.name }
            <SkillGrid>
              <SkillStats />
            </SkillGrid>
        </div>
      } else {
        return <div>Loading...</div>
      }
    }

    return (
      <DidGetData />
    );
  }
}

const SkillGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  grid-template-columns: repeat(5, 1fr);
  width: 80%;
  height: 80%;
  margin: 0 auto;
`;

const Skill = styled.div`
  text-align: center;
  image {
    margin: 0 auto;
  }
`;

export default App;
