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
      username: "",
      error: null,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
  getData(username) {

    const spaces = username.replace(' ', '%20');

    const url = `https://cors-anywhere.herokuapp.com/https://apps.runescape.com/runemetrics/profile/profile?user=%22${spaces}%22`;

    axios.get(url)
      .then(res => {
        // and here, setting both images and data on page load.

        if (res.data.error) {
          this.setState({
            error: res.data.error
          });
        } else {
          this.setState({
            data: res.data,
            error: null,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });

    this.setState({
      xpIndex: this.createXPLevelArray()
    });
  }

  handleChange({ target }) {
    const val = target.value
    this.setState({
      username: val
    });
  }

  handleSubmit(event) {
    if (event.keyCode) {
      if (event.keyCode === 13) {
        this.getData(this.state.username);
      }
    }
  }

  componentDidMount() {
    // importing all skill images from their directory.
    const images = this.importAllImages(require.context('./assets', false, /\.(png|jpe?g|svg)$/));

    this.setState({
      images: images
    });
  }

  render() {

    const hasData = this.state.data !== null;

    const SkillStats = () => {      
      return this.state.data.skillvalues.map(skill => 
        <Skill key={ skill.id }>

          <div className="info">
            <img src={ this.state.images[`${skillIndex[skill.id].name}-icon.png`] } alt="skill logo"/>
          </div>

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
      if (hasData) {
        return <div>
            <SkillGrid>
              <SkillStats />
            </SkillGrid>
        </div>
      } else {
        return <div></div>
      }
    }

    return (
      <Main>
        <PageHeader>92 / 99</PageHeader>
        <p>Enter username. View level progress.</p>

        <input type="text" value={this.state.username} onChange={this.handleChange} onKeyUp={this.handleSubmit} />

        <button onClick={this.handleSumbit}>Get My Stats</button>
        <DidGetData />
      </Main>
    );
  }
}

const SkillGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  grid-template-columns: repeat(5, 1fr);
  margin: 0 auto;
`;

const Skill = styled.div`
  text-align: center;
  image {
    margin: 0 auto;
  }
  .info {
    z-index: 1;
    position: relative;
    top: 50%;
  }
`;

const PageHeader = styled.h1`
  font-family: "Press Start 2P", sans-serif;
  text-align: center;
  font-size: 30px;
  margin-bottom: .5em;
`;

const Main = styled.div`
  text-align: center;
  background: #603813;  
  background: -webkit-linear-gradient(#b29f94, #603813); 
  background: linear-gradient(#b29f94, #603813);
  height: 100vh;
  padding: 1em;
`;

export default App;
