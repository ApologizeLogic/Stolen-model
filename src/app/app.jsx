import React from 'react';
import ReactDOM from 'react-dom';
// import reactTapEventPlugin from 'react-tap-event-plugin'

// import Main from './components/Main'
// import List from './components/List'
// import Unsplash from './components/Unsplash'
// import UnsplashMotion from './components/scaleSlider/UnsplashMotion'
import LayerUnsplash from './components/scaleSlider/LayerUnsplash'

// reactTapEventPlugin()

ReactDOM.render((
  <LayerUnsplash />
), document.getElementById('app'));