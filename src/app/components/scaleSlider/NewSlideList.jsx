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
    if(nextprops.photoProportion === this.props.photoProportion) return false
    return true
  }

  render() {

    let states = this.state
    let props = this.props

    let maxStyle = {
      width: props.imageList.length * window.innerWidth
    }

    console.log('NewSlideList render')

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
