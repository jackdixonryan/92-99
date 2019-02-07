import React, { Component } from 'react';
import axios from 'axios';
import skillIndex from './skills';
import Agility from './assets/Agility-icon.png';

class App extends Component {

  // setting the default state to null.
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      images: null,
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
  }
  render() {

    const SkillStats = () => {      
      return this.state.data.skillvalues.map(skill => 
        <div key={ skill.id }>
          <h1>{ skillIndex[skill.id].name }</h1>
          <img src={ this.state.images[`${skillIndex[skill.id].name}-icon.png`] } alt="skill logo"/>
          <p>{ skill.level }</p>
          <p>{ skill.xp }</p>
          <p>{ skill.rank }</p>
        </div>
      );
    }
    // conditional render: need to wait until AXIOS request resolves before trying to pour data onto the page.
    const DidGetData = () => {
      if (this.state.data) {
        return <div>
            Welcome, { this.state.data.name }
            <SkillStats />
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

export default App;
