import React from 'react'
import TransitionEnd from '../utils/transitionEnd'

let winHeight = window.innerHeight
let winWidth = window.innerWidth
let firstTouchX = 0
let endTouchX = 0

class TouchSlider extends React.Component {
  constructor(props, context) {
    super(props, context);

    this._touchStart = this.touchStart.bind(this)
    this._touchMove = this.touchMove.bind(this)
    this._touchEnd = this.touchEnd.bind(this)

    this.state = {
      sliderX: 0,
    }
  }

  componentDidMount() {
    let touchBody = this.refs.slider
    touchBody.addEventListener('touchstart', this._touchStart)
    touchBody.addEventListener('touchmove', this._touchMove)
    touchBody.addEventListener('touchend', this._touchEnd)
  }

  touchStart(ev) {
    ev.preventDefault()

    let touchobj = ev.changedTouches[0]
    firstTouchX = touchobj.clientX
  }

  touchMove(ev) {
    ev.preventDefault()
  }

  touchEnd(ev) {
    ev.preventDefault()
    let touchobj = ev.changedTouches[0]
    endTouchX = touchobj.clientX - firstTouchX
    let sliderX = this.state.sliderX
    let maxWidth = ( this.props.imageList.length - 1 ) * winWidth * -1

    if(endTouchX <= 0){
      this.setState({
        sliderX: sliderX <= maxWidth ? maxWidth : sliderX - winWidth
      })
    }else{
      this.setState({
        sliderX: sliderX < 0 ? sliderX + winWidth : 0
      })
    }
  }

  itemClassName(i) {
    if(i === this.state.sliderX / winWidth * -1){
      return 'un-nav-item un-nav-item-current'
    }
    return 'un-nav-item'
  }

  render() {
    let props = this.props
    let states = this.state

    let sliderStyle = {
      width: props.imageList.length * winWidth,
      transform: `translate3d(${states.sliderX}px, 0, 0)`
    }

    let imageSlide = []
    let navItem = []

    props.imageList.map((img, index)=>{
      imageSlide.push(
        <div key={index} className='un-sliders-item'>
          <img src={img} />
        </div>
      )
      navItem.push(
        <button key={index} className={this.itemClassName(index)}></button>
      )
    })

    return (
      <div ref='slider' className='un-photo-slider'>
        <div className='un-sliders' style={sliderStyle}>
          {imageSlide}
        </div>
        <div className='un-nav'>
          {navItem}
        </div>
      </div>
    );
  }
}

export default TouchSlider;
