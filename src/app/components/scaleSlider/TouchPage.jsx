import React from 'react'

import TransitionEnd from '../../utils/transitionEnd'

let winHeight = window.innerHeight
let winWidth = window.innerWidth
let imageMarginTop = 0                         // 记录图片距离top值
let imageScale = 0                             // 记录图片需要放大的尺寸
let imageTranslateY = 0                        // 记录图片移动的值
let defaultScaleStyle = {}                     // 传入获取图片基础信息

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
    console.debug(nextprops, nextstate)
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

    this.setState({
      scaleImg: img,
      scaleImageStyle: Object.assign(defaultScaleStyle, {
        transform: `translate3d(0, ${imageTranslateY}px, 0) scale3d(${imageScale}, ${imageScale}, 1)`,
      }),
    })

  }

  imageScaleClose(e) {
    this.setState({
      scaleImageStyle: Object.assign(defaultScaleStyle, {
        transform: `translate3d(0, 0, 0) scale3d(1, 1, 1)`,
      }),
    })

    TransitionEnd(e.target.parentElement, ()=>{
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
      <div className={states.pageClass} ref='mgPage' style={pageStyle}>
        <div className='un-photo-scale' style={states.scaleImageStyle}>
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
