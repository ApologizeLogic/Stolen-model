import React from 'react'

import TransitionEnd from '../../utils/transitionEnd'
import NewSlideList from './NewSlideList'

let winHeight = window.innerHeight
let winWidth = window.innerWidth
let firstTouchY = 0
let firstTouchX = 0
let imageMarginTop = 0                         // 记录图片距离 top 值
let imageScale = 0                             // 记录图片需要放大的尺寸
let imageTranslateY = 0                        // 记录图片移动的值
let photoProportion = 0                        // 图片的宽高比
let defaultScaleStyle = {}                     // 传入获取图片基础信息
let newImageList = []                          // 作为 slide 组件的 props 传入

let scaleProportion = 0                        // 放大和触摸移动比例
let translateProportion = 0                    // 移动和触摸比例
let pageState = 'slide'

function throttle(fn, delay) {
  let allowSample = true
  return function(e) {
    if (allowSample) {
      allowSample = false
      setTimeout(function() { allowSample = true }, delay)
      fn(e)
    }
  }
}

class TouchPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.imageScale = this.imageScale.bind(this)
    this.imageScaleClose = this.imageScaleClose.bind(this)
    this.winTouchStart = this.winTouchStart.bind(this)
    this.winTouchMove = this.winTouchMove.bind(this)
    this.winTouchEnd = this.winTouchEnd.bind(this)

    this.state = {
      pageClass:       'un-photo-page',
      scaleImg:        null,
      scaleImageStyle: null,
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.showPhotoTilt){
      this.imageScale(nextProps.imageData, nextProps.imgSrc)
    }
  }

  shouldComponentUpdate(nextprops, nextstate) {
    return true
  }

  imageScale(imageData, img) {
    // let imageData = this.props.imageData
    imageMarginTop = imageData.top
    imageScale = winHeight / imageData.height
    imageTranslateY = winHeight/2 - (imageData.top + imageData.height/2 )

    defaultScaleStyle = {
      top: imageData.top,
      left: imageData.left,
      height: imageData.height,
      width: imageData.width,
    }

    let curStyle = Object.assign({}, defaultScaleStyle, {
      transform: `translate3d(0, ${imageTranslateY}px, 0) scale3d(${imageScale}, ${imageScale}, 1)`,
    })

    this.setState({
      scaleImg: img,
      scaleImageStyle: curStyle,
    })

    newImageList = this.context.imageList.slice(0)
    newImageList.splice(0, 0, img)

    photoProportion = imageData.width/imageData.height

    TransitionEnd(this.refs.scale, ()=>{
      this.setState({
        pageClass: 'un-photo-page un-slide-model',
      })
    })

    let mgPage = this.refs.page
    mgPage.addEventListener('touchstart', this.winTouchStart)
    mgPage.addEventListener('touchmove', this.winTouchMove)
    mgPage.addEventListener('touchend', this.winTouchEnd)

  }

  imageScaleClose(e) {
    this.setState({
      scaleImageStyle: defaultScaleStyle,
    })

    TransitionEnd(this.refs.scale, ()=>{
      this.context.closePage()
    })
  }

  winTouchStart(e) {
    let touchobj = e.changedTouches[0]
    firstTouchY = touchobj.clientY
    firstTouchX = touchobj.clientX

    translateProportion = imageMarginTop / 250
    scaleProportion = (imageScale - 1) / 250
  }

  winTouchMove(e) {
    e.preventDefault()
    let moving = () => {
      let touchobj = e.changedTouches[0]
      let touchY = touchobj.clientY
      let touchX = touchobj.clientX
      let touchYDelta = firstTouchY - touchY
      let touchXDelta = touchX - firstTouchX

      if( touchYDelta > 50 && pageState !== 'narrow' && pageState !== 'blog') {
        this.setState({
          pageClass: 'un-photo-page un-narrow-model',
        })
        pageState = 'narrow'
      }

      if(pageState === 'narrow') {

        let delVal = touchYDelta - 50
        let scaleStyle = Object.assign({}, defaultScaleStyle, {
          transform: `translate3d(0, ${delVal * translateProportion * -1}px, 0) scale3d(${imageScale - delVal * scaleProportion}, ${imageScale - delVal * scaleProportion}, 1)`,
          transition: `transform .1s linear`,
        })
        if(delVal >= 250) {
          pageState = 'blog'
          scaleStyle = Object.assign({}, defaultScaleStyle, {
            transform: `translate3d(0, ${imageMarginTop * -1}px, 0) scale3d(1, 1, 1)`,
            transition: `transform .1s linear`,
          })
        }
        this.setState({
          scaleImageStyle: scaleStyle
        })

      }else if (pageState === 'blog') {
        return
      }

    }

    throttle(moving(), 60)
  }

  winTouchEnd(e) {
    let touchobj = e.changedTouches[0]
    let touchY = touchobj.clientY
    let touchX = touchobj.clientX
    let touchYDelta = firstTouchY - touchY
    let touchXDelta = touchX - firstTouchX

    if(touchYDelta > 50){
      pageState = 'blog'
      
      this.setState({
        scaleImageStyle: Object.assign({}, defaultScaleStyle, {
          transform: `translate3d(0, ${imageMarginTop * -1}px, 0) scale3d(1, 1, 1)`,
          transition: `transform .3s ease`,
        }),
      })

      TransitionEnd(this.refs.scale, ()=>{
        this.setState({
          pageClass: 'un-photo-page un-blog-model',
        })
      })
    }

  }

  render() {

    let states = this.state
    let props = this.props

    let pageStyle = {
      visibility: props.showPhotoTilt ? 'visible' : 'hidden',
    }

    let transformStyle = states.scaleImg ? {
      backgroundImage: `url(${states.scaleImg})`,
      transform: `translate3d(0, 0, 0)`,
    } : null

    return (
      <div className={states.pageClass} ref='page' style={pageStyle}>
        <NewSlideList
          imageList={newImageList}
          photoProportion={photoProportion}
        >
        </NewSlideList>
        <div className='un-photo-scale' ref='scale' style={states.scaleImageStyle}>
          <div className='un-photo-transform' style={transformStyle} onClick={this.imageScaleClose}></div>
        </div>
        <div className='un-photo-blog'>
          <div className='un-blog-content'></div>
        </div>
      </div>
    );
  }
}

TouchPage.contextTypes = {
  imageList: React.PropTypes.array,
  closePage: React.PropTypes.func,
}

export default TouchPage;
