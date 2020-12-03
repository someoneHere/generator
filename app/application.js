import React from 'react'
import _ from 'lodash'
import { Input, Icon, Button, Typography, Popover } from 'antd'
import Dropzone from 'react-dropzone'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

class Application extends React.Component {
  state = {
    productList: [],
    areas: [],
    pointStart: null,
    pointEnd: null,
    title: '商品页'
  }
  // 初始化
  componentDidMount() {
    document.addEventListener('mouseup', this.saveSelected)
  }
  handleDownload = () => {
    let zip = new JSZip()
    let areas = _.reduce(this.state.areas, (result, area, index) => {
      let product = this.state.productList[index]
      let dom = ''
      if (product && product[1]) {
        dom = `<a class='area' href='${product[1]}' style="left: ${area.left}; top: ${area.top}; width: ${area.width}; height: ${area.height}" target='_blank'></a>`
      }
      return result + dom
    }, '')
    zip.file(
      'index.html',
      temp.replace('{{areas}}', areas)
        .replace('{{fileName}}', this.state.file.name)
        .replace('{{title}}', this.state.title)
    );
    let img = zip.folder('images');
    img.file(this.state.file.name, this.state.file, { base64: true });
    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        saveAs(content, 'product2.zip');
      });
  }
  handleChangeTitle = (e) => {
    this.setState({
      title: e.target.value
    })
  }
  saveSelected = () => {
    let { pointStart, pointEnd, areas } = this.state
    let rect = this.area.getBoundingClientRect()
    if (!pointStart || !pointEnd) {
      return null
    }
    let left = Math.min(this.state.pointStart.x, this.state.pointEnd.x) / rect.width * 100 + '%'
    let top = Math.min(this.state.pointStart.y, this.state.pointEnd.y) / rect.height * 100 + '%'
    let width = Math.abs(this.state.pointEnd.x - this.state.pointStart.x) / rect.width * 100 + '%'
    let height = Math.abs(this.state.pointEnd.y - this.state.pointStart.y) / rect.height * 100 + '%'
    areas.push({ left, top, width, height })
    this.setState({
      areas,
      pointStart: null,
      pointEnd: null
    })
    this.start = false
  }
  handleChangeProduct = e => {
    this.setState({
      productList: _.map(_.compact(e.target.value.split('\n')), item => {
        return item.split('\t')
      })
    })
  }
  handleChangeImage = (files) => {
    this.setState({
      file: files[0]
    })
  }
  // 开始选取
  handleMouseDown = (e) => {
    e.preventDefault()
    let rect = this.area.getBoundingClientRect()
    this.start = true
    this.setState({
      pointStart: {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y
      }
    })
  }
  // 结束选取
  handleMouseUp = (e) => {
    e.preventDefault()
    this.start = false
  }
  // 移动中实时展示列表
  handleMouseMove = (e) => {
    e.preventDefault()
    if (this.start) {
      let rect = this.area.getBoundingClientRect()
      this.setState({
        pointEnd: {
          x: e.clientX - rect.x,
          y: e.clientY - rect.y
        }
      })
    }
  }
  renderActiveArea = () => {
    let { pointStart, pointEnd } = this.state
    if (!pointStart || !pointEnd) {
      return null
    }
    let left = Math.min(this.state.pointStart.x, this.state.pointEnd.x)
    let top = Math.min(this.state.pointStart.y, this.state.pointEnd.y)
    let width = Math.abs(this.state.pointEnd.x - this.state.pointStart.x)
    let height = Math.abs(this.state.pointEnd.y - this.state.pointStart.y)
    return (
      <div
        className='active-area'
        style={{left, top, width, height}}
      />
    )
  }
  handleDelete = (index, e) => {
    e.preventDefault()
    e.stopPropagation()
    let areas = this.state.areas
    areas.splice(index, 1)
    this.setState({
      areas
    })
  }
  renderAreas = () => {
    return _.map(this.state.areas, (item, index) => {
      let { left, top, width, height } = item
      let productName = _.get(this.state.productList, `[${index}][0]`)
      return (
        <div
          className='area'
          style={{ left, top, width, height }}
        >
          商品{index + 1}：{productName || '-'}
          <div className='close' onClick={this.handleDelete.bind(this, index)}>
            <Icon type='close-circle' />
          </div>
        </div>
      )
    })
  }
  render() {
    return (
      <div className='Application'>
        <Typography.Title>商品页面生成器</Typography.Title>
        <div className='header'>
          页面名称：
          <Input placeholder='页面名称' value={this.state.title} onChange={this.handleChangeTitle} style={{display: 'inline-block'}} />
          <Button
            type='primary'
            disabled={_.isEmpty(this.state.productList) || _.isEmpty(this.state.areas)}
            onClick={this.handleDownload}
          >
            导出压缩包
          </Button>
          <Popover placement='bottom' content={(
            <ul>
              <li>1. 从excel表中复制商品名称及链接，一个商品一行，第一列为名称，第二列为商品链接</li>
              <li>2. 粘贴到右侧输入框</li>
              <li>3. 上传图片</li>
              <li>4. 在图片上按照excel上的顺序框选商品</li>
              <li>5. 点击导出压缩包</li>
            </ul>
          )}>
            <Button type='link' className='tips'>
              使用说明
            </Button>
          </Popover>
        </div>
        <div className='f-clearfix'>
          <div className='image-area' ref={_ref => { this.area = _ref }}>
            {
              this.state.file ? (
                <div
                  className='preview'
                  onMouseDown={this.handleMouseDown}
                  onMouseUp={this.handleMouseUp}
                  onMouseMove={this.handleMouseMove}
                >
                  <img
                    id='image'
                    src={this.state.file.preview}
                  />
                  {this.renderActiveArea()}
                  {this.renderAreas()}
                </div>
              ) : (
                <Dropzone
                  className='dropzone'
                  onDrop={this.handleChangeImage}
                  accept={this.props.accept}
                >
                  <Icon type='upload' /> 拖动或点击上传图片
                </Dropzone>
              )
            }
          </div>
          <div className='input-area'>
            <Input.TextArea
              placeholder='请从excel表中粘贴名称及链接'
              onChange={this.handleChangeProduct}
            />
          </div>
        </div>
      </div>
    )
  }
}

const temp = `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>{{title}}</title>
      <style>
        * {margin: 0; padding: 0; box-sizing: border-box;}
        html {min-width: 320px; max-width: 640px; margin: 0 auto; font-size: 12px; font-family: PingFangSC-Regula,Helvetica Neue,Helvetica,microsoft yahei,sans-serif; background-color: #fff;}
        img {width: 100%;}
        .areas {position: relative;}
        .area {position: absolute;}
      </style>
    </head>
    <body>
      <div class='areas'>
        {{areas}}
        <img src="./images/{{fileName}}"/>
      </div>
    </body>
  </html>
`

export default Application