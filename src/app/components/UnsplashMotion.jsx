import React from 'react'
import { spring, Motion, presets } from 'react-motion';

import '../style/unsplash.scss';
import TransitionEnd from '../utils/transitionEnd'

import img1 from '../images/1.jpg'
import img2 from '../images/2.jpg'
import img3 from '../images/3.jpg'
import img4 from '../images/4.jpg'
import img5 from '../images/5.jpg'
import img6 from '../images/6.jpg'

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
    }
  }

  componentDidMount() {
    winHeight = window.innerHeight;
    winWidth = window.innerWidth;
  }

  handelImage(e, img) {
    e.preventDefault()
    document.body.style.overflow = 'hidden'

    let imageData = e.target.getBoundingClientRect()

    let defaulScaleStyle = {
      top: imageData.top,
      left: imageData.left,
      height: imageData.height,
      width: imageData.width,
    }

    let scaleStyle = {
      top: spring(0),
      height: spring(winHeight),
      width: spring(( imageData.width / imageData.height ) * winHeight),
      left: spring( (( imageData.width / imageData.height ) * winHeight - winWidth) / -2),
    }

    this.setState({
      scaleImg: img,
      defaulScaleStyle: defaulScaleStyle,
      scaleStyle: scaleStyle,
      showPhotoTilt: true,
    })
  }

  handelImageClose(e) {
    let imageData = this.state.defaulScaleStyle

    let scaleStyle = {
      top: spring(imageData.top),
      left: spring(imageData.left),
      height: spring(imageData.height),
      width: spring(imageData.width),
    }

    this.setState({
      pageOpen: true,
      scaleStyle: scaleStyle,
    })
    // TransitionEnd(e.target.parentElement, ()=>{
    //   this.setState({
    //     showPhotoTilt: false,
    //   })
    //   document.body.style.overflow = 'auto'
    // })
  }

  hiddenPage() {
    if(this.state.pageOpen){
      this.setState({
        pageOpen: false,
        showPhotoTilt: false,
        defaulScaleStyle: null,
      })
      document.body.style.overflow = 'auto'
    }
  }

  render() {

    let states = this.state

    let pageStyle = states.showPhotoTilt ? {
      opacity: 1,
      pointerEvents: 'auto',
    } : {
      opacity: 0,
      pointerEvents: 'none',
    }

    let transformStyle = states.scaleImg ? {
      backgroundImage: `url(${states.scaleImg})`,
      transform: `transition3d(0, 0, 0)`,
    } : null

    let photoTilt = (
      <div className='un-photo-page' style={pageStyle}>
      { this.state.defaulScaleStyle ? (
        <Motion defaultStyle={this.state.defaulScaleStyle} style={this.state.scaleStyle} onRest={this.hiddenPage}>
          { 
            interpolatingStyle => (
              <div className='un-photo-scale' style={interpolatingStyle}>
                <div className='un-photo-transform' style={transformStyle} onClick={this.handelImageClose}></div>
              </div>
            )
          }
        </Motion> ): null
      }
      </div>
    )

    return (
      <div className='un-container'>
        <div className='un-grid-single'>
          {
            imageList.map((img, index)=>{
              let bgStyle = {
                backgroundImage: `url(${img})`,
                height: 250,                   // 需要检测图片原始高度再根据高宽比显示
              }
              return (
                <div key={index} className='un-grid-item'>
                  <div className='un-grid-pro'>
                    <span>
                      <img className='un-grid-portrait' src='https://images.unsplash.com/profile-1465711356836-8ac8cef76fff?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=ff0de384ba28a3440d35e8854edcf782' />
                      <div className='un-grid-name'>Evan Kirby</div>
                    </span>
                  </div>
                  <div className='un-grid-image' style={bgStyle} onClick={(e) => this.handelImage(e, img)}>
                  </div>
                </div>
              )
            })
          }
        </div>
        <span>
          {photoTilt}
        </span>
      </div>
    );
  }
}

export default Unsplash;