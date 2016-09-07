import React from 'react';

import '../style/main.scss';

import TransitionEnd from '../utils/transitionEnd'

let firstTouchX, 
    initialScroll,
    startTime,
    endTime,
    isSwipe = false
let swipeRule = {
  moveLength: 150,
  moveTime: 300,
}

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
    ev.preventDefault()

    let touchobj = ev.changedTouches[0]
    firstTouchX = parseInt(touchobj.clientX);
    initialScroll = this.state.shortX

    startTime = new Date().getTime()
  }

  touchMove(ev) {
    ev.preventDefault()
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
    ev.preventDefault()
    let touchobj = ev.changedTouches[0]
    let touchX = parseInt(touchobj.clientX)
    let touchXDelta = touchX - firstTouchX

    let elapsedTime = new Date().getTime() - startTime

    if(elapsedTime <= swipeRule.moveTime && Math.abs(touchXDelta) >= swipeRule.moveLength) {
      isSwipe = true
      this.setState({
        shortX: initialScroll + touchXDelta/elapsedTime * 300
      })

      TransitionEnd(this.refs.container,()=>{
        isSwipe = false
      })

    }

    initialScroll = 0

  }

  render() {
    let containerStyle = isSwipe ? {
      transition: `all .8s cubic-bezier(0.11, 0.55, 0.58, 1)`,
      transform: `translate3d(${this.state.shortX}px, 0, 0)`,
    } : {
      transform: `translateX(${this.state.shortX}px)`,
    }

    return (
      <div className='bt-content' ref='touchbody'>
        <div className='bt-background'>
          
        </div>
        <div className='bt-container' ref='container' style={containerStyle}>
          <div className='bt-box'></div>
          <div className='bt-box'></div>
          <div className='bt-box'></div>
        </div>
      </div>
    );
  }
}

export default Main;
