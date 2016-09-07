import React from 'react';

import '../style/scroller.scss'
//import '../lib/Animate.js'

import Scroller from '../lib/Scroller.js'

let firstTouchX, initialScroll

function throttle(fn, delay) {
  let allowSample = true;

  return function(e) {
    if (allowSample) {
      allowSample = false;
      setTimeout(function() { allowSample = true; }, delay);
      fn(e);
    }
  };
}

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.addListener = this.addListener.bind(this);
    this._touchStart = this.touchStart.bind(this);
    this._touchMove = this.touchMove.bind(this);
    this._touchEnd = this.touchEnd.bind(this);

    this.state = {
      shortX : 0,
    }
  }

  componentDidMount() {
    this.addListener()
  }

  addListener() {
    let touchBody = this.refs.touchbody
    touchBody.addEventListener('touchstart', this._touchStart)
    touchBody.addEventListener('touchmove', this._touchMove)
    touchBody.addEventListener('touchend', this._touchEnd)
  }

  touchStart(ev) {

    let touchobj = ev.changedTouches[0]
    firstTouchX = parseInt(touchobj.clientX);
    initialScroll = this.state.shortX

  }

  touchMove(ev) {
    let moving = () => {
      let touchobj = ev.changedTouches[0]
      let touchX = parseInt(touchobj.clientX)
      let touchXDelta = touchX - firstTouchX

      if(initialScroll + touchXDelta < 0) {
        this.setState({
          shortX: initialScroll + touchXDelta,
        })
      }

    }

    throttle(moving(), 30)
  }

  touchEnd(ev) {
    let touchobj = ev.changedTouches[0]
    let touchX = parseInt(touchobj.clientX)
    let touchXDelta = touchX - firstTouchX
    initialScroll = 0

  }

  render() {
    let containerStyle = {
      transform: `translateX(${this.state.shortX}px)`,
    }

    return (
      <div className='bt-content' ref='touchbody'>
        <div className='bt-background'>
          
        </div>
        <div className='bt-container' style={containerStyle}>
          <div className='bt-box'></div>
          <div className='bt-box'></div>
          <div className='bt-box'></div>
        </div>
      </div>
    );
  }
}

export default Main;
