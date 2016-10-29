import React from 'react'

let winHeight = window.innerHeight
let winWidth = window.innerWidth

class ImageList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handelImage = this.handelImage.bind(this)
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextprops, nextstate) {
    return false
  }

  handelImage(e, img, key) {
    this.props.handelImage(e, img, key)
  }

  render() {
    let props = this.props
    let states = this.state

    return (
      <div className='un-grid-single'>
        {
          props.demoData.map((news, index)=>{
            
            let imgUrl = news.detail.srcList[0]
            if(!imgUrl) return
              
            let imgDom = new Image()
                imgDom.src = imgUrl
            let naturalWidth = imgDom.width
            let naturalHeight = imgDom.height
            let realHeight = winWidth * ( naturalHeight / naturalWidth )

            let bgStyle = {
              backgroundImage: `url(${imgUrl})`,
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
                <div className='un-grid-image' style={bgStyle} onClick={(e) => this.handelImage(e, imgUrl, index)}>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default ImageList;
