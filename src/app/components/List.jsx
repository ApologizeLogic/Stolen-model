import React from 'react'
import Hammer from 'hammerjs'

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

let reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

function patchPosition(w, boxW) {
  return Math.round(w/boxW) * boxW
}

let firstTouchX = 0, 
    initialScroll = 0, 
    timeStamp = 0,
    boxWidth = 0,
    isSwipe = false,
    isMoved = false

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.initHammer = this.initHammer.bind(this)
    this.onPanStart = this.onPanStart.bind(this)
    this.onPanMove = this.onPanMove.bind(this)
    this.onSwipe = this.onSwipe.bind(this)
    this.onPanEnd = this.onPanEnd.bind(this)

    this.state = {
      shortX : 0,
    }
  }

  componentDidMount() {
    this.initHammer()
  }

  initHammer() {
    let selectBox = this.refs.touchbody
    boxWidth = document.body.offsetWidth - selectBox.clientWidth
    let mc = new Hammer.Manager(selectBox)
    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }))
    mc.add(new Hammer.Swipe({threshold: 50, velocity: 0.6})).recognizeWith(mc.get('pan'))

    mc.on("panstart", this.onPanStart)
    mc.on("panmove", this.onPanMove)
    mc.on("panend", this.onPanEnd)
    mc.on("swipe", this.onSwipe)

  }

  onPanStart(ev) {
    ev.preventDefault()
    firstTouchX = ev.deltaX
    timeStamp = ev.timeStamp
    initialScroll = this.state.shortX
  }

  onPanMove(ev) {
    ev.preventDefault()
    let touchXDelta = ev.deltaX - firstTouchX
    let timeDelta = ev.timeStamp - timeStamp

    if(touchXDelta + initialScroll < 0) {
      isSwipe = false
      isMoved = false
      this.setState({
        shortX: (touchXDelta + initialScroll) > boxWidth ? (touchXDelta + initialScroll) : boxWidth,
      })
    }
  }

  onPanEnd(ev) {
    ev.preventDefault()
    isMoved = true
    this.setState({
      shortX: patchPosition(this.state.shortX, 350),
    })
  }

  onSwipe(ev) {
    ev.preventDefault()
    isSwipe = true
    let angle = ev.deltaX > 0 ? this.state.shortX + ev.deltaX * 3 : this.state.shortX + ev.deltaX * 3
    if (angle < 0) {
      this.setState({
        shortX: angle > boxWidth ? patchPosition(angle, 350) : boxWidth,
      })
    }else {
      this.setState({
        shortX: 0,
      })
    }
  }

  render() {
    let imageIndex = Math.round( - this.state.shortX/350 )
    let backgroundImageList = []
    let boxImageList = []

    let containerStyle = isSwipe ? {
      transition: `all .6s cubic-bezier(0.11, 0.55, 0.58, 1)`,
      transform: `translate3d(${this.state.shortX}px, 0, 0)`,
    } : isMoved ? {
      transition: `all .2s ease`,
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
        <div key={index} className='bt-box'>
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
