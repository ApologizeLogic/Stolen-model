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
let pageState = 'slide'                        // 分别表示几个状态 slide 模式、 blog 模式、 narrow 缩小、 enlarge 放大
let maxTranslateY = 0                          // Blog Content 所能移动的最大值
let contentMoveY = 0                           // 暂存 Blog Content 移动的 Y 轴值
let runEndFun = true                           // 是否执行 TouchEnd 里的函数
let canMove = true                             // 是否可以缩放切换模式

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
    this.startPhotoTilt = this.startPhotoTilt.bind(this)
    this.winTouchStart = this.winTouchStart.bind(this)
    this.winTouchMove = this.winTouchMove.bind(this)
    this.winTouchEnd = this.winTouchEnd.bind(this)

    this.state = {
      pageClass:       'un-photo-page',
      scaleImg:        null,
      scaleImageStyle: null,
      curPageNum:      0,
      contentMoveY:    0,
      pageTrans:       false,
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

  getChildContext() {
    return { 
      pageState: pageState,
      startPhotoTilt: this.startPhotoTilt,
    }
  }

  startPhotoTilt(state) {
    if(state){
      canMove = false
      this.setState({
        pageClass: 'un-photo-page un-slide-model un-tilt-model',
      })
    }else{
      canMove = true
      this.setState({
        pageClass: 'un-photo-page un-slide-model',
      })
    }
  }

  imageScale(imageData, img) {
    // let imageData = this.props.imageData
    winHeight = window.innerHeight
    winWidth = window.innerWidth
    
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
    if(pageState === 'slide' && this.state.curPageNum === 0) {
      this.setState({
        pageClass: 'un-photo-page',
        scaleImageStyle: defaultScaleStyle,
      })

      TransitionEnd(this.refs.scale, ()=>{
        this.context.closePage()
      })
    } else {
      this.setState({
        pageClass: 'un-photo-page un-page-trans',
        contentMoveY: 0,
        pageTrans: true,
      })

      TransitionEnd(this.refs.page, ()=>{
        pageState = 'slide'
        this.context.closePage()
        this.setState({
          pageClass: 'un-photo-page',
          curPageNum: 0,
          scaleImageStyle: defaultScaleStyle,
          pageTrans: false
        })
      })
    }
  }

  winTouchStart(e) {
    if(!canMove) return

    let touchobj = e.changedTouches[0]
    firstTouchY = touchobj.clientY
    firstTouchX = touchobj.clientX

    translateProportion = (imageMarginTop + imageTranslateY) / 250
    scaleProportion = (imageScale - 1) / 250

    let blogContent = this.refs.blog
    let blogContentData = blogContent.getBoundingClientRect()
    maxTranslateY = winHeight - blogContentData.height
    contentMoveY = this.state.contentMoveY
  }

  winTouchMove(e) {
    e.preventDefault()
    if(!canMove) return

    let moving = () => {
      let touchobj = e.changedTouches[0]
      let touchY = touchobj.clientY
      let touchX = touchobj.clientX
      let touchYDelta = firstTouchY - touchY
      let touchXDelta = touchX - firstTouchX

      // 从 slide 模式过渡到 blog 模式
      if( touchYDelta > 50 && pageState !== 'narrow' && pageState !== 'blog') {
        pageState = 'narrow'
        this.setState({
          pageClass: 'un-photo-page un-narrow-model',
          // scaleImg: newImageList[this.state.curPageNum],
        })
        return
      }

      // 从 slide 模式过渡到 blog 模式, TouchMove 图片在缩小时
      if(pageState === 'narrow' && touchYDelta > 50 ) {

        let delVal = touchYDelta - 50
        let scaleStyle = Object.assign({}, defaultScaleStyle, {
          transform: `translate3d(0, ${imageTranslateY - delVal * translateProportion}px, 0) scale3d(${imageScale - delVal * scaleProportion}, ${imageScale - delVal * scaleProportion}, 1)`,
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

        return
      } 

      // 从 blog 模式过渡到 slide 模式
      if(pageState === 'blog' && runEndFun && touchYDelta < -50) {
        pageState = 'enlarge'
        this.setState({
          pageClass: 'un-photo-page un-enlarge-model',
        })
        return
      }

      // 从 blog 模式过渡到 slide 模式, TouchMove 图片在放大时
      if(pageState === 'enlarge' && touchYDelta < -50) {

        let delVal = touchYDelta * -1 - 50
        let scaleStyle = Object.assign({}, defaultScaleStyle, {
          transform: `translate3d(0, ${delVal * translateProportion - imageMarginTop}px, 0) scale3d(${1 + delVal * scaleProportion}, ${1 + delVal * scaleProportion}, 1)`,
          transition: `transform .1s linear`,
        })

        if(delVal >= 250) {
          pageState = 'slide'
          scaleStyle = Object.assign({}, defaultScaleStyle, {
            transform: `translate3d(0, ${imageTranslateY}px, 0) scale3d(${imageScale}, ${imageScale}, 1)`,
            transition: `transform .1s linear`,
          })
        }

        this.setState({
          scaleImageStyle: scaleStyle
        })

        return
      }

      // blog 模式时 移动 Blog Content
      if(pageState === 'blog' && touchYDelta >= 0) {
        let intli = Math.max( (contentMoveY - touchYDelta), maxTranslateY)
        if(intli < 0) {
          runEndFun = false
        }
        this.setState({
          contentMoveY: intli
        })
        return
      }
      if(pageState === 'blog' && touchYDelta < 0) {
        let intli2 = Math.min( (contentMoveY - touchYDelta), 0)
        if(intli2 === 0) {
          runEndFun = true
        }
        this.setState({
          contentMoveY: intli2
        })
        return
      }

    }

    throttle(moving(), 60)
  }

  winTouchEnd(e) {
    if(!canMove) return

    let touchobj = e.changedTouches[0]
    let touchY = touchobj.clientY
    let touchX = touchobj.clientX
    let touchYDelta = firstTouchY - touchY
    let touchXDelta = touchX - firstTouchX

    // 左右滑动时执行函数
    if( pageState === 'slide' && touchXDelta > 80 || pageState === 'slide' && touchXDelta < -80 ) {
      let curPageNum = this.state.curPageNum

      if ( touchXDelta < 0 ){
        curPageNum++
      } else {
        curPageNum--
      }

      if(curPageNum >= newImageList.length - 1) {
        curPageNum = newImageList.length - 1
      } else if (curPageNum < 0) {
        curPageNum = 0
      }

      this.setState({
        curPageNum: curPageNum,
        scaleImg: newImageList[curPageNum],
      })
      return
    } 

    // 上下移动缩小时执行
    if(touchYDelta > 50 && runEndFun){
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

      return
    }

    // 上下移动时放大执行
    if(touchYDelta < -50 && runEndFun){
      pageState = 'slide'

      this.setState({
        scaleImageStyle: Object.assign({}, defaultScaleStyle, {
          transform: `translate3d(0, ${imageTranslateY}px, 0) scale3d(${imageScale}, ${imageScale}, 1)`,
          transition: `transform .3s ease`,
        }),
      })

      TransitionEnd(this.refs.scale, ()=>{
        this.setState({
          pageClass: 'un-photo-page un-slide-model',
        })
      })

      return
    }
  }

  render() {

    let states = this.state
    let props = this.props

    let pageStyle = {
      visibility: props.showPhotoTilt ? 'visible' : 'hidden',
      transform: states.pageTrans ? `translate3d(100%, 0, 0)` : `translate3d(0, 0, 0)`
    }

    let transformStyle = states.scaleImg ? {
      backgroundImage: `url(${states.scaleImg})`,
    } : null

    let fakeTransformStyle = states.scaleImg ? {
      // 暂时无效 需要同 :before 一同修改
      // height: defaultScaleStyle.height,
      transform: `translateY(${states.contentMoveY/3}px)`,
      backgroundImage: `url(${states.scaleImg})`,
    } : null

    let contentStyle = {
      transform: `translateY(${states.contentMoveY}px)`,
    }

    return (
      <div className={states.pageClass} ref='page' style={pageStyle}>
        <div className='un-back-buttom' onClick={this.imageScaleClose}>
          <i className='icon-circle-left'></i>
        </div>
        <NewSlideList
          imageList={newImageList}
          photoProportion={photoProportion}
          curPageNum={states.curPageNum}
        >
        </NewSlideList>
        <div className='un-photo-scale' ref='scale' style={states.scaleImageStyle}>
          <div className='un-photo-transform' style={transformStyle}></div>
        </div>
        <div className='un-photo-blog' ref='blog' style={contentStyle}>
          <div className='un-blog-content'></div>
        </div>
        <div className='un-fake-scale' style={fakeTransformStyle}></div>
      </div>
    );
  }
}

TouchPage.contextTypes = {
  imageList: React.PropTypes.array,
  closePage: React.PropTypes.func,
}

TouchPage.childContextTypes = {
  pageState: React.PropTypes.string,
  startPhotoTilt: React.PropTypes.func
}

export default TouchPage;
