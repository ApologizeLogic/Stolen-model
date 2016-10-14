import React from 'react'
import { spring, Motion, presets } from 'react-motion';
import ImageList from './ImageList'
import PhotoTiltBox from './PhotoTiltBox'

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
let firstTouchX = 0
let photoProportion = 0       // 图片的长宽比
let initPageY = 0             // 页面 Y 轴移动时变量
let maxPageY = 0              // 页面所能移动的最大值
let slideWidth = 0            // 图片 list 的总长度
let slideState = 'crImg'      // 'crImg' 表示当前是全屏图片, 'crBlog' 表示当前转为 Blog 形式
let imgCanDelea = true
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
    // this.handelImageClose = this.handelImageClose.bind(this)
    // this.hiddenPage = this.hiddenPage.bind(this)
    this.winTouchStart = this.winTouchStart.bind(this)
    this.winTouchMove = this.winTouchMove.bind(this)
    this.winTouchEnd = this.winTouchEnd.bind(this)

    this.state = {
      showPhotoTilt : false,
      scaleImg      : null,
      defaulScaleStyle : null,
      scaleStyle    : null,
      pageOpen      : false,
      defaulSlideStyle: null,
      slideStyle    : null,
      pageTransY    : 0,
      slideTranX    : 0,

      curBox        : 0,
      startPhotoTilt: false,
    }
  }

  componentDidMount() {
    winHeight = window.innerHeight;
    winWidth = window.innerWidth;
  }

  handelImage(e, img) {
    e.preventDefault()
    let mgPage = this.refs.mgPage
    mgPage.addEventListener('touchstart', this.winTouchStart)
    mgPage.addEventListener('touchmove', this.winTouchMove)
    mgPage.addEventListener('touchend', this.winTouchEnd)

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

    let blogBody = this.refs.blogBody.getBoundingClientRect()
    // maxPageY 等于 crBlog 状态的 Image 高度加上 blogBody 的高度, 再加上 padding 值
    maxPageY = (blogBody.height + winWidth / photoProportion + 30 - winHeight) * -1
    slideWidth = imageList.length * winWidth

    let defaulSlideStyle = {
      top: 0,
      height: winHeight,
      width: slideWidth,
      left: 0,
    }

    let slideStyle = {
      top: 0,
      height: spring(winHeight),
      width: slideWidth,
      left: 0,
    }

    this.setState({
      scaleImg: img,
      defaulScaleStyle: defaulScaleStyle,
      scaleStyle: scaleStyle,
      showPhotoTilt: true,

      defaulSlideStyle: defaulSlideStyle,
      slideStyle: slideStyle,
    })
  }

  winTouchStart(e) {
    // e.preventDefault()
    let touchobj = e.changedTouches[0]
    firstTouchY = touchobj.clientY
    firstTouchX = touchobj.clientX
    initPageY = this.state.pageTransY
    // 'crImg' 状态下不可以向下移动
    imgCanDelea = this.state.slideStyle.height.val === winHeight
  }

  winTouchMove(e) {
    e.preventDefault()
    let moving = () => {
      let touchobj = e.changedTouches[0]
      let touchY = touchobj.clientY
      let touchX = touchobj.clientX
      let touchYDelta = firstTouchY - touchY
      let touchXDelta = touchX - firstTouchX

      if ( slideState === 'crBlog' ) {
        let pageTransY = initPageY - touchYDelta * 1.2
        if(pageTransY > 0){
          slideState = 'crImg'
          pageTransY = 0
        } else if (pageTransY < maxPageY) {
          pageTransY = maxPageY
        }
        this.setState({
          pageTransY: pageTransY
        })
        return
      }

      if ( Math.abs(touchYDelta) < 50 || Math.abs(touchXDelta) > 80 ) return

      // 'crImg' 状态下不可以向下移动
      if ( imgCanDelea && touchYDelta < 0 ) return

      let defaultStyle = this.state.defaulScaleStyle

      let height = 0

      if ( touchYDelta < 0 ) {
        height = defaultStyle.height - touchYDelta > winHeight ? winHeight : defaultStyle.height - touchYDelta
      } else {
        height = winHeight - touchYDelta
      }
      
      let width = photoProportion * height

      if ( width < winWidth ){
        width = winWidth
        height = winWidth / photoProportion
      }

      let slideStyle = {
        top: 0,
        left: 0,
        height: spring(height),
        width: slideWidth, 
      }

      this.setState({
        slideStyle: slideStyle,
      })

    }

    throttle(moving(), 60)
  }

  winTouchEnd(e) {
    // e.preventDefault()
    let touchobj = e.changedTouches[0]
    let touchY = touchobj.clientY
    let touchX = touchobj.clientX
    let touchYDelta = touchY - firstTouchY
    let touchXDelta = touchX - firstTouchX

    if ( Math.abs(touchXDelta) > 80 ) {
      let slideTranX = this.state.slideTranX

      if(touchXDelta > 0) {
        slideTranX += winWidth
      } else {
        slideTranX -= winWidth
      }

      if (slideTranX < winWidth - slideWidth || slideTranX > 0) return

      this.setState({
        slideTranX: slideTranX
      })

      return
    }

    if ( Math.abs(touchYDelta) < 50 || slideState === 'crBlog' ) return

    if ( touchYDelta < 0) {
      slideState = 'crBlog'
      this.setState({
        slideStyle: {
          top: 0,
          height: spring(winWidth / photoProportion),
          left: 0,
          width: slideWidth,
        }
      })
    } else {
      slideState = 'crImg'
      this.setState({
        slideStyle: {
          top: 0,
          height: spring(winHeight, springConfig),
          left: 0,
          width: slideWidth,
        }
      })
    }

  }

  // handelImageClose(e) {
  //   let imageData = this.state.defaulScaleStyle

  //   let scaleStyle = {
  //     top: spring(imageData.top, springConfig),
  //     left: spring(imageData.left, springConfig),
  //     height: spring(imageData.height, springConfig),
  //     width: spring(imageData.width, springConfig),
  //   }

  //   this.setState({
  //     pageOpen: true,
  //     scaleStyle: scaleStyle,
  //   })
  // }

  // hiddenPage() {
  //   if(this.state.pageOpen){
  //     this.setState({
  //       pageOpen: false,
  //       showPhotoTilt: false,
  //       defaulScaleStyle: null,
  //     })
  //     window.removeEventListener('touchstart', winTouchStart)
  //     window.removeEventListener('touchmove', this.winTouchMove)
  //     window.removeEventListener('touchend', this.winTouchEnd)
  //   }
  // }

  render() {

    let states = this.state

    let pageStyle = {
      // opacity: states.showPhotoTilt ? 1 : 0,
      // pointerEvents: states.showPhotoTilt ? 'auto' : 'none',
      visibility: states.showPhotoTilt ? 'visible' : 'hidden',
    }

    let containStyle = {
      transform: `translateY(${states.pageTransY}px)`,
    }

    let transformStyle = states.scaleImg ? {
      backgroundImage: `url(${states.scaleImg})`,
      transform: `translate3d(0, 0, 0)`,
    } : null

    // { this.state.defaulScaleStyle ? (
    //   <Motion defaultStyle={this.state.defaulScaleStyle} style={this.state.scaleStyle} onRest={this.hiddenPage}>
    //     { 
    //       interpolatingStyle => (
    //         <div className='un-photo-scale' style={interpolatingStyle}>
    //           <div className='un-photo-transform' style={transformStyle} onClick={this.handelImageClose}></div>
    //         </div>
    //       )
    //     }
    //   </Motion> ): null
    // }

    let photoTilt = (
      <div className='un-photo-page' ref='mgPage' style={pageStyle}>
        <div className='un-photo-container' style={containStyle}>
          { states.defaulSlideStyle ? (
            <Motion defaultStyle={states.defaulSlideStyle} style={states.slideStyle}>
              {
                interpolatingStyle => (
                  <div className='un-photo-slide-ul' style={{
                    top: interpolatingStyle.top,
                    left: interpolatingStyle.left,
                    height: interpolatingStyle.height,
                    width: interpolatingStyle.width,
                    transform: `translate3d(${states.slideTranX}px, 0, 0)`
                  }}>
                    {
                      imageList.map((img, index)=>{
                        let height = interpolatingStyle.height
                        let slideImgStyle = {
                          height: height,
                          width: photoProportion * height,
                          backgroundImage: `url(${img})`,
                        }

                        return (
                          <PhotoTiltBox 
                            key={index} 
                            slideImgStyle={slideImgStyle} 
                            >
                          </PhotoTiltBox>
                        )
                      })
                    }
                  </div>
                )
              }
            </Motion> ) : null
          }
          <div className={states.showPhotoTilt ? 'un-photo-blog un-show-blog' : 'un-photo-blog'}>
            <div className='un-blog-content' ref='blogBody'>
              
            </div>
          </div>
        </div>
      </div>
    )

    return (
      <div className='un-container'>
        <div className='un-grid-single'>
          <ImageList
            imageList={imageList}
            handelImage={this.handelImage}
          >
          </ImageList>
        </div>
        <span>
          {photoTilt}
        </span>
      </div>
    );
  }
}

export default Unsplash;