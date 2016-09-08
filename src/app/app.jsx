import React from 'react';
import ReactDOM from 'react-dom';
import reactTapEventPlugin from 'react-tap-event-plugin'

import Main from './components/Main'
import List from './components/List'

reactTapEventPlugin()

ReactDOM.render((
  <Main />
), document.getElementById('app'));