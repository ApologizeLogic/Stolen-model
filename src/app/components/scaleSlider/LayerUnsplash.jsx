import React from 'react'
import { spring, Motion, presets } from 'react-motion';
import ImageList from './ImageList'
import PhotoTiltBox from './PhotoTiltBox'

import '../../style/layer.scss'
import TransitionEnd from '../../utils/transitionEnd'

import img1 from '../../images/1.jpeg'
import img2 from '../../images/2.jpeg'
import img3 from '../../images/3.jpg'
import img4 from '../../images/4.jpg'
import img5 from '../../images/5.jpg'
import img6 from '../../images/6.jpg'
import img7 from '../../images/7.jpg'

let imageList = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7
]

let winHeight = 0
let winWidth = 0
let firstTouchY = 0
let firstTouchX = 0
let photoProportion = 0       // 图片的长宽比
let initPageY = 0             // 页面 Y 轴移动时变量
let maxPageY = 0              // 页面所能移动的最大值
let slideWidth = 0            // 图片 list 的总长度
let slideState = 'crImg'      // 'crImg' 表示当前是全屏图片, 'crBlog' 表示当前转为 Blog 形式
let imgCanDelea = true
let transitionTime = 500
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

class Unsplash extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handelImage = this.handelImage.bind(this)
    this.handelImageClose = this.handelImageClose.bind(this)
    this.hiddenPage = this.hiddenPage.bind(this)

    this.state = {
      showPhotoTilt : false,
      scaleImg      : null,
      defaulScaleStyle : null,
      scaleStyle    : null,
      pageOpen      : false,
      defaulSlideStyle : null,
      slideStyle    : null,
      pageTransY    : 0,
      slideTranX    : 0,
      pageClass     : 'un-photo-page',
    }
  }

  getChildContext() {
    return { name: "Jonas" }
  }

  componentDidMount() {
    winHeight = window.innerHeight;
    winWidth = window.innerWidth;
  }

  handelImage(e, img) {
    e.preventDefault()

    let imageData = e.target.getBoundingClientRect()
    photoProportion = imageData.width / imageData.height
    let imageScale = winHeight / imageData.height
    let imageTranslateY = winHeight/2 - (imageData.top + imageData.height/2 )

    let defaulScaleStyle = {
      top: imageData.top,
      left: imageData.left,
      height: imageData.height,
      width: imageData.width,
      translate: 0,
      scale: 1,
    }

    let scaleStyle = {
      top: imageData.top,
      left: imageData.left,
      height: imageData.height,
      width: imageData.width,
      translate: spring(imageTranslateY, springConfig),
      scale: spring(imageScale, springConfig),
    }

    this.setState({
      scaleImg: img,
      defaulScaleStyle: defaulScaleStyle,
      scaleStyle: scaleStyle,
      showPhotoTilt: true,
    })

    setTimeout(()=>{
      this.setState({
        pageClass: 'un-photo-page un-aninma-out',
      })
    }, transitionTime)
  }

  handelImageClose(e) {
    let imageData = this.state.defaulScaleStyle

    let scaleStyle = {
      top: imageData.top,
      left: imageData.left,
      height: imageData.height,
      width: imageData.width,
      translate: spring(0, springConfig),
      scale: spring(1, springConfig),
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
    }
  }

  render() {

    let states = this.state

    let pageStyle = {
      visibility: states.showPhotoTilt ? 'visible' : 'hidden',
    }

    let transformStyle = states.scaleImg ? {
      backgroundImage: `url(${states.scaleImg})`,
      transform: `translate3d(0, 0, 0)`,
    } : null

    let photoTilt = (
      <div className={states.pageClass} ref='mgPage' style={pageStyle}>
        { this.state.defaulScaleStyle ? (
          <Motion defaultStyle={this.state.defaulScaleStyle} style={this.state.scaleStyle} onRest={this.hiddenPage}>
            {
              interpolatingStyle => (
                <div className='un-photo-scale' style={{
                  top: interpolatingStyle.top,
                  left: interpolatingStyle.left,
                  width: interpolatingStyle.width,
                  height: interpolatingStyle.height,
                  transform: `translate3d(0, ${interpolatingStyle.translate}px, 0) scale3d(${interpolatingStyle.scale}, ${interpolatingStyle.scale}, 1)`,
                }} onClick={this.handelImageClose}>
                  <div className='un-photo-transform' style={transformStyle}></div>
                </div>
              )
            }
          </Motion> ): null
        }
      </div>
    )

    return (
      <div className='un-container'>
        <ImageList
          imageList={imageList}
          handelImage={this.handelImage}
        >
        </ImageList>
        <span>
          {photoTilt}
        </span>
      </div>
    );
  }
}

Unsplash.childContextTypes = {
  name: React.PropTypes.string,
}

export default Unsplash;