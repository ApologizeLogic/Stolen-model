import React from 'react';
import ReactDOM from 'react-dom';
import reactTapEventPlugin from 'react-tap-event-plugin'

// import Main from './components/Main'
// import List from './components/List'
import Unsplash from './components/Unsplash'

reactTapEventPlugin()

ReactDOM.render((
  <Unsplash />
), document.getElementById('app'));