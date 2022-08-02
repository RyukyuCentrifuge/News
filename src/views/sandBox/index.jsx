import { Layout, Spin } from 'antd'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import './index.css'
import NProgress from 'nprogress'
import { connect } from 'react-redux'
import 'nprogress/nprogress.css'
const { Content } = Layout;
function NewsSandBox (props) {
  NProgress.start()
  useEffect(() => {
    NProgress.done()
  })
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <Spin size="large" spinning={props.isLoading}>
            <Outlet></Outlet>
          </Spin>
        </Content>
      </Layout>
    </Layout>
  )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
  return {
    isLoading
  }
}
export default connect(mapStateToProps)(NewsSandBox)
