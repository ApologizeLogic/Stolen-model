import React from 'react'

import TransitionEnd from '../../utils/transitionEnd'
import PhotoTiltBox from './PhotoTiltBox'

class NewSlideList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  shouldComponentUpdate(nextprops, nextstate) {
    if(nextprops.photoProportion === this.props.photoProportion && nextprops.curPageNum === this.props.curPageNum && nextprops.curKey === this.props.curKey) return false
    return true
  }

  itemClassName(index) {
    if(index === this.props.curPageNum) return 'un-nav-item un-nav-item-current'
    return 'un-nav-item'
  }

  render() {

    let states = this.state
    let props = this.props
    let imageSlide = []
    let navItem = []

    let maxStyle = {
      width: props.imageList.length * window.innerWidth,
      transform: `translateX(${props.curPageNum * window.innerWidth * -1}px)`
    }

    props.imageList.map((img, index)=>{
      let height = window.innerHeight
      let slideImgStyle = {
        height: height,
        width: props.photoProportion * height,
        backgroundImage: `url(${img})`,
      }

      imageSlide.push(
        <PhotoTiltBox 
          key={index} 
          slideImgStyle={slideImgStyle} 
          >
        </PhotoTiltBox>
      )

      navItem.push(
        <button key={index} className={this.itemClassName(index)}></button>
      )
    })

    return (
      <div className='un-photo-new-slide'>
        <div className='un-photo-background'></div>
        <div className='un-photo-slide-ul' style={maxStyle}>
          {imageSlide}
        </div>
        <div className='un-nav'>
            {navItem}
        </div>
      </div>
    );
  }
}

export default NewSlideList;
