import React from 'react'

let tiltState = false
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

const setTranslateX = function(node, amount) {
    node.style.webkitTransform =
    node.style.transform = "translateX(" + Math.round(amount) + "px)";
}

class PhotoTiltBox extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handelTilt = this.handelTilt.bind(this)
    this.startAnimat = this.startAnimat.bind(this)
    this.photoTilt = this.photoTilt.bind(this)

    this.state = {
      maxTilt: 30,
    }
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextprops, nextstate) {
    return true
  }

  componentWillReceiveProps(nextProps) {
    //console.log(nextProps)
  }

  handelTilt(e) {
    tiltState = !tiltState
    if(tiltState){
      this.initMath()
      this.startAnimat()
      this.addEventListeners()
    }else{
      this.removeEventListeners()
    }
  }

  initMath() {
    imgNode = this.refs.tiltImg

    viewPort = {
        winHeight: window.innerHeight,
        winWidth: window.innerWidth,
    }

    imgData = imgNode.getBoundingClientRect()
    imgAspectRatio = imgData.width / imgData.height

  }

  startAnimat() {
    let tiltBarPadding = 20
    centerOffset = (imgData.width - viewPort.winWidth) / 2
    tiltBarWidth = viewPort.winWidth - tiltBarPadding

    tiltBarIndicatorWidth = (viewPort.winWidth * tiltBarWidth) / imgData.width

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

      console.log(pxToMove)

      if(tiltState){

        this.updateImgPosition(pxToMove * -1)

        window.requestAnimationFrame(this.photoTilt)

      }else{

        // this.updateImgPosition(0)  在结束时设置回居中属性
        imgNode.style.transform = "translateX(-50%)";
      }
  }

  updateImgPosition(pxToMove) {
      setTranslateX( imgNode, pxToMove - (imgData.width / 2) );
  }

  render() {
    let props = this.props
    let states = this.state

    return (
      <div className='un-photo-slide-li'>
        <div className='un-photo-slide-li-img' onClick={this.handelTilt} ref='tiltImg' style={props.slideImgStyle}></div>
        <div className="un-photo-bar" style={barStyle}>
          <div ref="tiltBar" className="un-bar-indicoter"></div>
        </div>
      </div>
    )
  }
}

export default PhotoTiltBox;
