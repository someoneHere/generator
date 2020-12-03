/**
 * 项目入口
 * @authors huangweiduo (huangweiduo@corp.netease.com)
 */
import React from 'react'
import ReactDom from 'react-dom'
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
// 全局样式
import './style.less'
import Application from './application'


ReactDom.render(
  <ConfigProvider locale={zhCN}>
    <Application />
  </ConfigProvider>,
  document.getElementById('content')
)