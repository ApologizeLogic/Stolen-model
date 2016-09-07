import React from 'react';

import '../style/main.scss';
import TransitionEnd from '../utils/transitionEnd'

import img1 from '../images/1.jpg'
import img2 from '../images/2.jpg'
import img3 from '../images/3.jpg'
import img4 from '../images/4.jpg'
import img5 from '../images/5.jpg'
import img6 from '../images/6.jpg'

let imageList = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
]

let firstTouchX = 0, 
    initialScroll = 0,
    startTime = 0,
    endTime = 0,
    isSwipe = false,
    isMoved = false,
    winHeight = 0,
    winWidth = 0,
    boxWidth = 0,
    swipeRule = {
      moveLength: 150,
      moveTime: 300,
    }

function patchPosition(w, boxW) {
  return Math.round(w/boxW) * boxW
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
    winHeight = window.innerHeight;
    winWidth = window.innerWidth;
    this.addListener()
  }

  addListener() {
    let touchBody = this.refs.touchbody
    // boxWidth = winWidth - touchBody.clientWidth
    boxWidth = winWidth - touchBody.clientWidth
    touchBody.addEventListener('touchstart', this._touchStart)
    touchBody.addEventListener('touchmove', this._touchMove)
    touchBody.addEventListener('touchend', this._touchEnd)
  }

  touchStart(ev) {
    ev.preventDefault()

    let touchobj = ev.changedTouches[0]
    firstTouchX = touchobj.clientX
    initialScroll = this.state.shortX

    startTime = new Date().getTime()
  }

  touchMove(ev) {
    ev.preventDefault()
    let moving = () => {
      let touchobj = ev.changedTouches[0]
      let touchX = touchobj.clientX
      let touchXDelta = touchX - firstTouchX

      if(initialScroll + touchXDelta < 0) {
        isSwipe = false
        isMoved = false
        this.setState({
          shortX: (initialScroll + touchXDelta) > boxWidth ? (touchXDelta + initialScroll) : boxWidth,
        })
      }

    }

    throttle(moving(), 60)
  }

  touchEnd(ev) {
    ev.preventDefault()
    let touchobj = ev.changedTouches[0]
    let touchX = touchobj.clientX
    let touchXDelta = touchX - firstTouchX

    let elapsedTime = new Date().getTime() - startTime

    if(elapsedTime <= swipeRule.moveTime && Math.abs(touchXDelta) >= swipeRule.moveLength) {
      isSwipe = true
      let angle = initialScroll + touchXDelta/elapsedTime * 300
      if (angle < 0) {
        this.setState({
          shortX: angle > boxWidth ? patchPosition(angle, 350) : boxWidth,
        })
      } else {
        this.setState({
          shortX: 0,
        })
      }

      TransitionEnd(this.refs.touchbody,()=>{
        isSwipe = false
      })

    } else {
      isMoved = true
      this.setState({
        shortX: patchPosition(this.state.shortX, 350),
      })
    }

    initialScroll = 0

  }

  render() {
    let imageIndex = Math.round( - this.state.shortX/350 )
    let backgroundImageList = []
    let boxImageList = []

    let containerStyle = isSwipe ? {
      transition: `all .8s cubic-bezier(0.11, 0.55, 0.58, 1)`,
      transform: `translate3d(${this.state.shortX}px, 0, 0)`,
    } : isMoved ? {
      transition: `all .5s ease`,
      transform: `translate3d(${this.state.shortX}px, 0, 0)`,
    } : {
      transform: `translate3d(${this.state.shortX}px, 0, 0)`,
    }

    imageList.map((val, index) => {

      let backgroundStyle = {
        backgroundImage: `url(${val})`,
        backgroundRepeat : 'no-repeat',
        backgroundSize: 'cover',
        opacity: imageIndex === index ? 1 : 0,
      }

      backgroundImageList.push(
        <div key={index} className='bt-background' style={backgroundStyle}></div>
      )

      let boxStyle = {
        backgroundImage: `url(${val})`,
        backgroundPositionX: this.state.shortX / 4 + (index - 1) * 70,
      }

      boxImageList.push(
        <div key={index} className='bt-box' onClick={(e) => this.cloneBox(e, boxStyle)}>
          <div className='bt-box-banner' style={boxStyle}></div>
          <div className='bt-box-content'></div>
        </div>
      )
    })

    return (
      <div className='bt-content'>
        <div ref='touchbody' className='bt-container' style={containerStyle}>
          {boxImageList}
        </div>
        {backgroundImageList}
      </div>
    );
  }
}

export default Main;
