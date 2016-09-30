import React from 'react'
import TransitionEnd from '../utils/transitionEnd'

class PhototTilt extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handelImageTilt = this.handelImageTilt.bind(this)

    this.state = {

    }
  }

  componentDidMount() {
  }

  handelImageTilt(e) {
    this.props.handelImageClose(e)
  }

  render() {
    let props = this.props

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
      transform: `transition3d(0, 0, 0)`,
    } : null

    return (
      <div className='un-photo-page' style={pageStyle}>
        <div className='un-photo-scale' style={scaleStyle}>
          <div className='un-photo-transform' style={transformStyle} onClick={this.handelImageTilt}>
          </div>
        </div>
        <div className={props.scaleParameter !== 1 ? 'un-photo-zoom un-photo-zoom-show' : 'un-photo-zoom'}>
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
              <span className='un-bottom-option'>
                <i className="fa fa-info-circle" aria-hidden="true"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PhototTilt;
