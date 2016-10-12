import React from 'react'
import { spring, Motion, presets } from 'react-motion';

import '../../style/unsplash.scss';
import '../../style/scaleSlide.scss'
import TransitionEnd from '../../utils/transitionEnd'

import img1 from '../../images/1.jpg'
import img2 from '../../images/2.jpg'
import img3 from '../../images/3.jpg'
import img4 from '../../images/4.jpg'
import img5 from '../../images/5.jpg'
import img6 from '../../images/6.jpg'

let imageList = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
]

let winHeight = 0
let winWidth = 0
let firstTouchY = 0
let photoProportion = 0
let springConfig = {
  stiffness: 600,
  damping: 50,
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

function winTouchStart(e) {
  e.preventDefault()
  let touchobj = e.changedTouches[0]
  firstTouchY = touchobj.clientY
}

class Unsplash extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handelImage = this.handelImage.bind(this)
    this.handelImageClose = this.handelImageClose.bind(this)
    this.hiddenPage = this.hiddenPage.bind(this)
    this.winTouchMove = this.winTouchMove.bind(this)
    this.winTouchEnd = this.winTouchEnd.bind(this)

    this.state = {
      showPhotoTilt : false,
      scaleImg      : null,
      defaulScaleStyle : null,
      scaleStyle    : null,
      pageOpen      : false,
    }
  }

  componentDidMount() {
    winHeight = window.innerHeight;
    winWidth = window.innerWidth;
  }

  handelImage(e, img) {
    e.preventDefault()
    // document.documentElement.style.overflow = 'hidden'
    // document.body.style.overflow = 'hidden'
    window.addEventListener('touchstart', winTouchStart)
    window.addEventListener('touchmove', this.winTouchMove)
    window.addEventListener('touchend', this.winTouchEnd)

    let imageData = e.target.getBoundingClientRect()
    photoProportion = imageData.width / imageData.height

    let defaulScaleStyle = {
      top: imageData.top,
      left: imageData.left,
      height: imageData.height,
      width: imageData.width,
    }

    let scaleStyle = {
      top: spring(0, springConfig),
      height: spring(winHeight, springConfig),
      width: spring(photoProportion * winHeight, springConfig),
      left: spring( (photoProportion * winHeight - winWidth) / -2, springConfig),
    }

    this.setState({
      scaleImg: img,
      defaulScaleStyle: defaulScaleStyle,
      scaleStyle: scaleStyle,
      showPhotoTilt: true,
    })
  }

  winTouchMove(e) {
    e.preventDefault()
    let moving = () => {
      let touchobj = e.changedTouches[0]
      let touchY = touchobj.clientY
      let touchYDelta = firstTouchY - touchY

      if( Math.abs(touchYDelta) < 50 ) return

      let defaultStyle = this.state.defaulScaleStyle

      let height = 0

      if ( touchYDelta < 0) {
        height = defaultStyle.height - touchYDelta > winHeight ? winHeight : defaultStyle.height - touchYDelta
      } else {
        height = winHeight - touchYDelta
      }

      //let height = winHeight - touchYDelta > winHeight ? winHeight : winHeight - touchYDelta
      
      let width = photoProportion * height

      if ( width < winWidth ){
        width = winWidth
        height = winWidth / photoProportion
      }

      let left = (photoProportion * height - winWidth) / -2

      let scaleStyle = {
        top: 0,
        height: spring(height),
        left: spring(left),
        width: spring(width)
      }

      this.setState({
        scaleStyle: scaleStyle
      })


    }

    throttle(moving(), 60)
  }

  winTouchEnd(e) {
    e.preventDefault()
    let touchobj = e.changedTouches[0]
    let touchY = touchobj.clientY
    let touchYDelta = touchY - firstTouchY

    if( Math.abs(touchYDelta) < 50 ) return

    if( touchYDelta < 0) {
      this.setState({
        scaleStyle: {
          top: 0,
          height: spring(winWidth / photoProportion),
          left: spring(0),
          width: spring(winWidth)
        }
      })
    }else{
      this.setState({
        scaleStyle: {
          top: 0,
          height: spring(winHeight, springConfig),
          left: spring((photoProportion * winHeight - winWidth) / -2, springConfig),
          width: spring(photoProportion * winHeight, springConfig)
        }
      })
    }

  }

  handelImageClose(e) {
    let imageData = this.state.defaulScaleStyle

    let scaleStyle = {
      top: spring(imageData.top, springConfig),
      left: spring(imageData.left, springConfig),
      height: spring(imageData.height, springConfig),
      width: spring(imageData.width, springConfig),
    }

    this.setState({
      pageOpen: true,
      scaleStyle: scaleStyle,
    })

  }

  hiddenPage() {
    if(this.state.pageOpen){
      this.setState({
        pageOpen: false,
        showPhotoTilt: false,
        defaulScaleStyle: null,
      })
      window.removeEventListener('touchstart', winTouchStart)
      window.removeEventListener('touchmove', this.winTouchMove)
      window.removeEventListener('touchend', this.winTouchEnd)
    }
  }

  render() {

    let states = this.state

    let pageStyle = states.showPhotoTilt ? {
      opacity: 1,
      pointerEvents: 'auto',
    } : {
      opacity: 0,
      pointerEvents: 'none',
    }

    let transformStyle = states.scaleImg ? {
      backgroundImage: `url(${states.scaleImg})`,
      transform: `translate3d(0, 0, 0)`,
    } : null

    let photoTilt = (
      <div className='un-photo-page' style={pageStyle}>
        { this.state.defaulScaleStyle ? (
          <Motion defaultStyle={this.state.defaulScaleStyle} style={this.state.scaleStyle} onRest={this.hiddenPage}>
            { 
              interpolatingStyle => (
                <div className='un-photo-scale' style={interpolatingStyle}>
                  <div className='un-photo-transform' style={transformStyle} onClick={this.handelImageClose}></div>
                </div>
              )
            }
          </Motion> ): null
        }
        <div className={states.showPhotoTilt ? 'un-photo-blog un-show-blog' : 'un-photo-blog'}>
          <div className='un-blog-content'>
            
          </div>
        </div>
      </div>
    )

    return (
      <div className='un-container'>
        <div className='un-grid-single'>
          {
            imageList.map((img, index)=>{
              let bgStyle = {
                backgroundImage: `url(${img})`,
                height: 250,                   // 需要检测图片原始高度再根据高宽比显示
              }
              return (
                <div key={index} className='un-grid-item'>
                  <div className='un-grid-pro'>
                    <span>
                      <img className='un-grid-portrait' src='https://images.unsplash.com/profile-1465711356836-8ac8cef76fff?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=ff0de384ba28a3440d35e8854edcf782' />
                      <div className='un-grid-name'>Evan Kirby</div>
                    </span>
                  </div>
                  <div className='un-grid-image' style={bgStyle} onClick={(e) => this.handelImage(e, img)}>
                  </div>
                </div>
              )
            })
          }
        </div>
        <span>
          {photoTilt}
        </span>
      </div>
    );
  }
}

export default Unsplash;