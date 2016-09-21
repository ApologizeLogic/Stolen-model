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
    bannerStyle = {},
    contantStyle = {},
    winHeight = 0,
    winWidth = 0,
    boxWidth = 0,
    swipeRule = {
      moveLength: 150,
      moveTime: 300,
    }

function patchPosition(w, boxW, delta) {
  let bw = w/boxW
  // 判断向左和向右移动
  if (delta > 0) {
    return Math.ceil(bw) * boxW
  } else {
    return Math.ceil(bw * -1) * boxW * -1
  }
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

    this.addListener = this.addListener.bind(this)
    this._touchStart = this.touchStart.bind(this)
    this._touchMove = this.touchMove.bind(this)
    this._touchEnd = this.touchEnd.bind(this)

    this.cloneBox = this.cloneBox.bind(this)
    this.closeCover = this.closeCover.bind(this)

    this.state = {
      shortX : 0,
      coverEle: null,
      coverBannerStyle: null,
      coverContentStyle: null,
      showCover: false,
      coverClass: 'bt-cover',
    }
  }

  componentDidMount() {
    winHeight = window.innerHeight;
    winWidth = window.innerWidth;
    this.addListener()
  }

  addListener() {
    let touchBody = this.refs.touchbody
    // boxWidth = document.body.offsetWidth - touchBody.clientWidth
    boxWidth = winWidth - touchBody.clientWidth
    touchBody.addEventListener('touchstart', this._touchStart)
    touchBody.addEventListener('touchmove', this._touchMove)
    touchBody.addEventListener('touchend', this._touchEnd)
  }

  touchStart(ev) {
    //ev.preventDefault()

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
    //ev.preventDefault()
    let touchobj = ev.changedTouches[0]
    let touchX = touchobj.clientX
    let touchXDelta = touchX - firstTouchX

    let elapsedTime = new Date().getTime() - startTime

    if(elapsedTime <= swipeRule.moveTime && Math.abs(touchXDelta) >= swipeRule.moveLength) {
      isSwipe = true
      let angle = initialScroll + Math.ceil(touchXDelta/elapsedTime) * 500
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
        shortX: patchPosition(this.state.shortX, 350, touchXDelta),
      })
    }

    initialScroll = 0

  }

  cloneBox(e, style) {
    e.preventDefault()
    let cle = e.target.parentElement
    let banner = cle.children[0].getBoundingClientRect()
    let contant = cle.children[1].getBoundingClientRect()
    bannerStyle = Object.assign({
      width: banner.width,
      height: banner.height,
      top: banner.top,
      left: banner.left,
    }, style)
    contantStyle = {
      width: contant.width,
      height: contant.height,
      top: contant.top,
      left: contant.left,
    }

    this.setState({
      showCover: true,
      coverBannerStyle: bannerStyle,
      coverContentStyle: contantStyle,
    })

    let newBannerStyle = Object.assign({
      width: winWidth,
      height: banner.height,
      top: 0,
      left: 0,
    }, style)
    let newContantStyle = {
      width: winWidth,
      height: winHeight - banner.height,
      top: contant.top - banner.top,
      left: 0,
    }

    setTimeout(()=>{
      this.setState({
        coverClass: 'bt-cover bt-event',
        coverBannerStyle: newBannerStyle,
        coverContentStyle: newContantStyle,
      })
    }, 60)
  }

  closeCover() {
    this.setState({
      coverBannerStyle: bannerStyle,
      coverContentStyle: contantStyle,
    })

    TransitionEnd(this.refs.coverBanner,()=>{
      this.setState({
        showCover: false,
        coverClass: 'bt-cover',
      })
    })
  }

  render() {
    let imageIndex = Math.round( - this.state.shortX/350 )
    let backgroundImageList = []
    let boxImageList = []

    let containerStyle = isSwipe ? {
      transition: `all .8s cubic-bezier(0.11, 0.55, 0.58, 1)`,
      transform: `translate3d(${this.state.shortX}px, 0, 0)`,
    } : isMoved ? {
      transition: `all .6s ease`,
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
        //backgroundPositionX: this.state.shortX / 4 + (index - 1) * 70,
      }

      boxImageList.push(
        <div key={index} className='bt-box' onClick={(e) => this.cloneBox(e, boxStyle)}>
          <div className='bt-box-banner' style={boxStyle}></div>
          <div className='bt-box-content'></div>
        </div>
      )
    })

    let cover = this.state.showCover ? (
      <div onClick={this.closeCover}>
        <div className='bt-cover-banner' ref='coverBanner' style={this.state.coverBannerStyle}></div>
        <div className='bt-cover-content' style={this.state.coverContentStyle}></div>
      </div>
    ) : null

    return (
      <div className='bt-content'>
        <div ref='touchbody' className='bt-container' style={containerStyle}>
          {boxImageList}
        </div>
        {backgroundImageList}
        <div className={this.state.coverClass}>
          {cover}
        </div>
      </div>
    );
  }
}

export default Main;
