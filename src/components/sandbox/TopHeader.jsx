import React from 'react'
import { Layout, Dropdown, Avatar, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import WithRouter from '../WithRouter'
// 引入发布者模块
import { connect } from 'react-redux';

const { Header } = Layout;

function TopHeader (props) {
  const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <span>
              {roleName}
            </span>
          ),
        },
        {
          key: '4',
          danger: true,
          label: (
            <span style={{ 'display': "inline-block", "width": "100%" }} onClick={() => {
              localStorage.removeItem('token')
              props.history.push('/login', { replace: true })
            }}>退出</span>
          ),

        },
      ]}
    />
  );

  const changeCollapsed = () => {
    // 改变state中isCollapsed状态
    // console.log(props);
    props.changeCollapsed()
  } 

  return (
    <div>
      <Header className="site-layout-background" style={{ padding: '0 16px' }}>
        {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: () => changeCollapsed(),
        })}
        <div style={{ float: 'right' }}>
          <span>欢迎<span style={{ "color": "red" }}>{username}</span>回来</span>
          <Dropdown overlay={menu}>
            <span>
              <Avatar size="large" icon={<UserOutlined />} />
            </span>
          </Dropdown>
        </div>
      </Header>
    </div>
  )
}

// 将redux中的初始值接受并返回给UI组件
const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
}

// 对初始值进行改变
const mapDispathchToProps = {
  changeCollapsed(){
    return {
      type:"change_collapsed",
      // payload:""
    } // action
  }
}
export default connect(mapStateToProps,mapDispathchToProps)(WithRouter(TopHeader))