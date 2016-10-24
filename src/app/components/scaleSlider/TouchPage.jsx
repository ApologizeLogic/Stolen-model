import React from 'react'

import TransitionEnd from '../../utils/transitionEnd'
import NewSlideList from './NewSlideList'

let winHeight = window.innerHeight
let winWidth = window.innerWidth
let imageMarginTop = 0                         // 记录图片距离top值
let imageScale = 0                             // 记录图片需要放大的尺寸
let imageTranslateY = 0                        // 记录图片移动的值
let photoProportion = 0                        // 图片的宽高比
let defaultScaleStyle = {}                     // 传入获取图片基础信息
let newImageList = []

class TouchPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.imageScale = this.imageScale.bind(this)
    this.imageScaleClose = this.imageScaleClose.bind(this)

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

  }

  imageScaleClose(e) {
    this.setState({
      scaleImageStyle: defaultScaleStyle,
    })

    TransitionEnd(this.refs.scale, ()=>{
      this.context.closePage()
    })

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
      <div className={states.pageClass} style={pageStyle}>
        <NewSlideList
          imageList={newImageList}
          photoProportion={photoProportion}
        >
        </NewSlideList>
        <div className='un-photo-scale' ref='scale' style={states.scaleImageStyle}>
          <div className='un-photo-transform' style={transformStyle} onClick={this.imageScaleClose}></div>
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
