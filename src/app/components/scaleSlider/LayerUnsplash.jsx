import React from 'react'
import { spring, Motion, presets } from 'react-motion';
import ImageList from './ImageList'
import TouchPage from './TouchPage'

import '../../style/layer.scss'

import img1 from '../../images/1.jpeg'
import img2 from '../../images/2.jpeg'
import img3 from '../../images/3.jpg'
import img4 from '../../images/4.jpg'
import img5 from '../../images/5.jpg'
import img6 from '../../images/6.jpg'
import img7 from '../../images/7.jpg'

let imageList = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7
]

class LayerUnsplash extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handelImage = this.handelImage.bind(this)
    this.handelImageClose = this.handelImageClose.bind(this)

    this.state = {
      showPhotoTilt : false,
      scaleImg      : null,
      imageData     : null,
    }
  }

  getChildContext() {
    return { 
      imageList: imageList,
      closePage: this.handelImageClose,
    }
  }

  componentDidMount() {
  }

  handelImage(e, img) {
    e.preventDefault()

    let imageData = e.target.getBoundingClientRect()
    
    this.setState({
      showPhotoTilt: true,
      imageData: imageData,
      scaleImg: img,
    })
  }

  handelImageClose() {
    this.setState({
      showPhotoTilt: false,
    })
  }

  render() {

    let states = this.state

    return (
      <div className='un-container'>
        <ImageList
          imageList={imageList}
          handelImage={this.handelImage}
        >
        </ImageList>
        <span>
          <TouchPage
            showPhotoTilt={states.showPhotoTilt}
            imgSrc={states.scaleImg}
            imageData={states.imageData}
          >
          </TouchPage>
        </span>
      </div>
    );
  }
}

LayerUnsplash.childContextTypes = {
  imageList: React.PropTypes.array,
  closePage: React.PropTypes.func,
}

export default LayerUnsplash;