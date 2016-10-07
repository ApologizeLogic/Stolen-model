import React from 'react'
import PhotoTilt from './PhotoTilt'

import '../style/unsplash.scss';
import TransitionEnd from '../utils/transitionEnd'

import img1 from '../images/1.jpg'
import img2 from '../images/2.jpg'
import img3 from '../images/3.jpg'
import img4 from '../images/4.jpg'
import img5 from '../images/5.jpg'
import img6 from '../images/6.jpg'
import img7 from '../images/7.jpg'

let imageList = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
]

let winHeight = window.innerHeight
let winWidth = window.innerWidth
let imageMarginTop = 0                         // 记录图片距离top值
let imageScale = 0                             // 记录图片需要放大的尺寸
let imageTranslateX = 0                         // 记录图片移动的值

function preventDefault(e) {
  e.preventDefault()
}

class Unsplash extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handelImage = this.handelImage.bind(this)
    this.handelImageClose = this.handelImageClose.bind(this)
    this.handelBlog = this.handelBlog.bind(this)
    this.handelBlogClose = this.handelBlogClose.bind(this)

    this.state = {
      showPhotoTilt: false,
      scaleImg : null,
      imageData : null,
      scaleParameter: 1,
      tyParameter: 0,
    }
  }

  componentDidMount() {
  }

  handelImage(e, img) {
    e.preventDefault()
    document.body.style.overflow = 'hidden'

    let imageData = e.target.getBoundingClientRect()
    imageMarginTop = imageData.top
    imageScale = winHeight / imageData.height
    imageTranslateX = winHeight/2 - (imageData.top + imageData.height/2 )

    this.setState({
      scaleImg: img,
      imageData: imageData,
      showPhotoTilt: true,
      scaleParameter: imageScale,
      tyParameter: imageTranslateX,
    })
  }

  handelImageClose(e) {
    this.setState({
      scaleParameter: 1,
      tyParameter: 0,
    })
    // TransitionEnd(e.target.parentElement, ()=>{
    //   this.setState({
    //     showPhotoTilt: false,
    //   })
    //   document.body.style.overflow = 'auto'
    // })
    setTimeout(()=>{
      this.setState({
        showPhotoTilt: false,
      })
      document.body.style.overflow = 'auto'
    }, 400)
  }

  handelBlog() {
    this.setState({
      scaleParameter: 1,
      tyParameter: -1 * imageMarginTop,
    })
  }

  handelBlogClose() {
    this.setState({
      scaleParameter: imageScale,
      tyParameter: imageTranslateX,
    })
  }

  render() {

    let states = this.state

    return (
      <div className='un-container'>
        <div ref='list' className='un-grid-single'>
          {
            imageList.map((img, index)=>{
              
              let imgDom = new Image()
                  imgDom.src = img
              let naturalWidth = imgDom.width
              let naturalHeight = imgDom.height
              let realHeight = winWidth * ( naturalHeight / naturalWidth )

              let bgStyle = {
                backgroundImage: `url(${img})`,
                height: realHeight || 250,                   // 需要检测图片原始高度再根据高宽比显示
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
          <PhotoTilt
            ref='photo'
            key='photo'
            showPhotoTilt={states.showPhotoTilt}
            imageData={states.imageData}
            tyParameter={states.tyParameter}
            scaleParameter={states.scaleParameter}
            scaleImg={states.scaleImg}
            handelImageClose={this.handelImageClose}
            handelBlog={this.handelBlog}
            handelBlogClose={this.handelBlogClose}
            imageList={imageList}
          >
          </PhotoTilt>
        </span>
      </div>
    );
  }
}

export default Unsplash;
