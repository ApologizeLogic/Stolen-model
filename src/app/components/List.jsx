import React from 'react'
import Hammer from 'hammerjs'

let reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

let firstTouchX = 0, 
    initialScroll = 0, 
    timeStamp = 0,
    isSwipe = false

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.initHammer = this.initHammer.bind(this)
    this.onPanStart = this.onPanStart.bind(this)
    this.onPanMove = this.onPanMove.bind(this)
    this.onSwipe = this.onSwipe.bind(this)

    this.state = {
      shortX : 0,
    }
  }

  componentDidMount() {
    this.initHammer()
  }

  initHammer() {
    let mc = new Hammer.Manager(this.refs.touchbody)
    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }))
    mc.add(new Hammer.Swipe({threshold: 50, velocity: 0.6})).recognizeWith(mc.get('pan'))

    mc.on("panstart", this.onPanStart);
    mc.on("panmove", this.onPanMove);
    mc.on("panend", this.onPanEnd);
    mc.on("swipe", this.onSwipe);

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
      this.setState({
        shortX: touchXDelta + initialScroll,
      })
    }
  }

  onPanEnd(ev) {
    ev.preventDefault()
  }

  onSwipe(ev) {
    ev.preventDefault()
    isSwipe = true
    let angle = ev.deltaX > 0 ? this.state.shortX + ev.deltaX * 3 : this.state.shortX + ev.deltaX * 3
    if (angle < 0) {
      this.setState({
        shortX: angle,
      })
    }else {
      this.setState({
        shortX: 0,
      })
    }
  }

  render() {
    let containerStyle = isSwipe ? {
      transition: `all .6s cubic-bezier(0.11, 0.55, 0.58, 1)`,
      transform: `translate3d(${this.state.shortX}px, 0, 0)`,
    } : {
      transform: `translate3d(${this.state.shortX}px, 0, 0)`,
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
