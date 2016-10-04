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
    this.handelBlog = this.handelBlog.bind(this)
    this.startTitl = this.startTitl.bind(this)
    this.stopTitl = this.stopTitl.bind(this)
    this.startAnimat = this.startAnimat.bind(this)
    this.photoTilt = this.photoTilt.bind(this)
    this.updateTiltBar = this.updateTiltBar.bind(this)

    this.state = {
      hiddenZoom: false,
      maxTilt: 30,
      pageClass: 'un-photo-page'
    }
  }

  componentDidMount() {
  }

  handelImageTilt(e) {
    e.preventDefault()
    this.state.hiddenZoom = false
    this.props.handelImageClose(e)
  }

  handelBlog(e) {
    e.preventDefault()
    this.setState({
      pageClass: 'un-photo-page un-show-blog'
    })
    this.props.handelBlog()
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

    let barStyle = {
      opacity: states.hiddenZoom ? 1 : 0
    }

    return (
      <div className={states.pageClass} style={pageStyle}>

        <div className='un-photo-scale' style={scaleStyle}>
          <div className='un-photo-transform' ref='overImage' style={transformStyle} onClick={this.handelImageTilt}>
          </div>
        </div>

        <div className="un-photo-bar" style={barStyle}>
          <div ref="overBar" className="un-bar-indicoter"></div>
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
              <span className='un-bottom-option' onClick={this.handelBlog}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
              </span>
              <span className='un-bottom-option' onClick={this.startTitl}>
                <i className="fa fa-info-circle" aria-hidden="true"></i>
              </span>
            </div>
          </div>
          
          <div className='un-zoom-fake' onClick={this.stopTitl}></div>
        </div>

        <div className='un-blog'>
          <div className='un-stamp'></div>
          <p>Strapless dresses, backless dresses – those dresses that scoop so low in the back so you have to wear a sticky bra. Celebs like Taylor Swift, Rihanna – even Princess Diana (yes, really!) may have rocked the trend on the red carpet and at royal events respectively, but ladies everywhere are following suit at slightly more plebeian events-and for good reason. When you show up at your friend’s wedding or that end-of-summer white party donning a backless dress, you’re sure to leave a memorable impression as you walk away showing off in such a subtly sexy way. If you should choose to rock the style, you’ll need to train all of the muscles in your back to work properly in order to get the look you want.</p>
          <p>Outside of just looking great, giving your back muscles a little TLC in the gym is key to reaching any body goal-whether that’s aesthetic, injury reduction, performance enhancement, or a combination of all three. “We have a tendency to over-emphasize the muscles you can see in the mirror, while neglecting the ones you cannot,” says Stefan Underwood, an expert with EXOS. “Forgetting to balance your pushing exercises with a pull can negatively affect your posture and worse, your overall movement quality,” he says</p>
        </div>
      </div>
    );
  }
}

export default PhototTilt;
