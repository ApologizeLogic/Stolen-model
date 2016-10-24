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
    if(nextprops.photoProportion === this.props.photoProportion && nextprops.curPageNum === this.props.curPageNum) return false
    return true
  }

  render() {

    let states = this.state
    let props = this.props

    let curPageNum = props.curPageNum

    if(curPageNum > props.imageList.length) {
      curPageNum = props.imageList.length
    } else if (curPageNum < 0) {
      curPageNum = 0
    }

    let maxStyle = {
      width: props.imageList.length * window.innerWidth,
      transform: `translateX(${curPageNum * window.innerWidth * -1}px)`
    }

    return (
      <div className='un-photo-slide-ul' style={maxStyle}>
        {
          props.imageList.map((img, index)=>{
            let height = window.innerHeight
            let slideImgStyle = {
              height: height,
              width: props.photoProportion * height,
              backgroundImage: `url(${img})`,
            }

            return (
              <PhotoTiltBox 
                key={index} 
                slideImgStyle={slideImgStyle} 
                >
              </PhotoTiltBox>
            )
          })
        }
      </div>
    );
  }
}

export default NewSlideList;
