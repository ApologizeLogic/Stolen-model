import React from 'react'
import TransitionEnd from '../utils/transitionEnd'

const setTranslateX = function(node, amount) {
    node.style.webkitTransform =
    node.style.transform = "translateX(" + Math.round(amount) + "px)";
}

let imgNode,
    barNode,
    imgData,
    imgAspectRatio,
    latestTilt,
    disableTilt,
    centerOffset,
    viewPort,
    tiltBarWidth,
    tiltBarIndicatorWidth,
    tiltCenterOffset


class PhototTilt extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handelImageTilt = this.handelImageTilt.bind(this)
    this.startTitl = this.startTitl.bind(this)
    this.stopTitl = this.stopTitl.bind(this)
    this.startAnimat = this.startAnimat.bind(this)
    this.photoTilt = this.photoTilt.bind(this)
    this.updateTiltBar = this.updateTiltBar.bind(this)

    this.state = {
      hiddenZoom: false,
      maxTilt: 20,
    }
  }

  componentDidMount() {
  }

  handelImageTilt(e) {
    e.preventDefault()
    this.state.hiddenZoom = false
    this.props.handelImageClose(e)
  }

  startTitl() {
    this.setState({
      hiddenZoom: true,
    })
    this.initMath()
    this.startAnimat()
    this.addEventListeners()
  }

  stopTitl() {
    this.setState({
      hiddenZoom: false,
    })
    this.removeEventListeners()
  }

  initMath() {
    imgNode = this.refs.overImage
    barNode = this.refs.overBar

    viewPort = {
        winHeight: window.innerHeight,
        winWidth: window.innerWidth,
    }

    imgData = imgNode.getBoundingClientRect()
    imgAspectRatio = imgData.width / imgData.height

  }

  startAnimat() {
    let tiltBarPadding = 20
    centerOffset = (imgData.width - viewPort.winWidth) / ( 2 * this.props.scaleParameter)
    tiltBarWidth = viewPort.winWidth - tiltBarPadding

    tiltBarIndicatorWidth = (viewPort.winWidth * tiltBarWidth) / imgData.width
    barNode.style.width = tiltBarIndicatorWidth + 'px'

    tiltCenterOffset = ((tiltBarWidth / 2) - (tiltBarIndicatorWidth / 2))

    if (tiltCenterOffset > 0) {
        disableTilt = false
    } else {
        disableTilt = true
        latestTilt = 0
    }

    this.photoTilt()
  }

  addEventListeners() {
      if (window.DeviceOrientationEvent) {

          window.addEventListener('deviceorientation', this.evenListFun, false)

          window.requestAnimationFrame(this.photoTilt)

      }
  }

  removeEventListeners() {
      window.removeEventListener('deviceorientation', this.evenListFun)
  }

  evenListFun(eventData) {
    let averageGamma = []

    if (!disableTilt) {

        if (averageGamma.length > 8) {
            averageGamma.shift();
        }

        averageGamma.push(eventData.gamma);

        latestTilt = averageGamma.reduce(function(a, b) { return a+b; }) / averageGamma.length;

    }
  }

  photoTilt() {
      let tilt = latestTilt
      let pxToMove

      if (tilt > 0) {
          tilt = Math.min(tilt, this.state.maxTilt)
      } else {
          tilt = Math.max(tilt, this.state.maxTilt * -1)
      }

      pxToMove = (tilt * centerOffset) / this.state.maxTilt

      console.log(centerOffset)

      if(this.state.hiddenZoom){

        this.updateImgPosition(pxToMove * -1)

        this.updateTiltBar(tilt)

        window.requestAnimationFrame(this.photoTilt)

      }else{

        this.updateImgPosition(0)
      }
  }

  updateTiltBar(tilt) {
      let pxToMove = (tilt * ((tiltBarWidth - tiltBarIndicatorWidth) / 2)) / this.state.maxTilt;
      setTranslateX(barNode, (tiltCenterOffset + pxToMove) );
  }

  updateImgPosition(pxToMove) {
      setTranslateX(imgNode, pxToMove);
  }

  render() {
    let props = this.props
    let states = this.state

    let pageStyle = props.showPhotoTilt ? {
      opacity: 1,
      pointerEvents: 'auto',
    } : {
      opacity: 0,
      pointerEvents: 'none',
    }

    let scaleStyle = props.imageData ? {
      top: props.imageData.top,
      left: props.imageData.left,
      height: props.imageData.height,
      width: props.imageData.width,
      transform: `translate3d(0, ${props.tyParameter}px, 0) scale3d(${props.scaleParameter}, ${props.scaleParameter}, 1)`,
    } : null

    let transformStyle = props.scaleImg ? {
      backgroundImage: `url(${props.scaleImg})`,
    } : null

    return (
      <div className='un-photo-page' style={pageStyle}>
        <div className='un-photo-scale' style={scaleStyle}>
          <div className='un-photo-transform' ref='overImage' style={transformStyle} onClick={this.handelImageTilt}>
          </div>
        </div>
        <div className={props.scaleParameter !== 1 && !states.hiddenZoom ? 'un-photo-zoom un-photo-zoom-show' : 'un-photo-zoom'}>
          
          <div className='un-photo-zoom-top'>
            <div className='un-zoom-logo' onClick={this.handelImageTilt}>
              <i className="fa fa-camera" aria-hidden="true"></i>
            </div>
            <div className='un-zoom-share'>
              <div className='un-zoom-opation un-zoom-like'>
                <i className="fa fa-heart" aria-hidden="true"></i>
                <a>256</a>
              </div>
              <div className='un-zoom-opation un-zoom-add'>
                <i className="fa fa-plus" aria-hidden="true"></i>
              </div>
              <div className='un-zoom-opation un-zoom-socia'>
                <i className="fa fa-share" aria-hidden="true"></i>
              </div>
            </div>
          </div>
          
          <div className='un-photo-zoom-bottom'>
            <div className='un-zoom-bottom-left'>
              <span>
                <img className='un-grid-portrait' src='https://images.unsplash.com/profile-1465711356836-8ac8cef76fff?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=ff0de384ba28a3440d35e8854edcf782' />
                <div className='un-grid-name'>Evan Kirby</div>
              </span>
            </div>
            <div className='un-zoom-bottom-right'>
              <span className='un-bottom-option'>
                <i className="fa fa-pencil" aria-hidden="true"></i>
              </span>
              <span className='un-bottom-option' onClick={this.startTitl}>
                <i className="fa fa-info-circle" aria-hidden="true"></i>
              </span>
            </div>
          </div>
          
          <div className='un-zoom-fake' onClick={this.stopTitl}></div>

          <div className="un-photo-bar">
            <div ref="overBar" className="un-bar-indicoter"></div>
          </div>

        </div>
      </div>
    );
  }
}

export default PhototTilt;
