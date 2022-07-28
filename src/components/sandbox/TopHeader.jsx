import React, { useState } from 'react'
import { Layout, Dropdown, Avatar, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import WithRouter from '../WithRouter'

const { Header } = Layout;

function TopHeader (props) {
  const [collapsed, setCollapsed] = useState(false)
  const {role:{roleName},username} = JSON.parse(localStorage.getItem('token'))
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

  return (
    <div>
      <Header className="site-layout-background" style={{ padding: '0 16px' }}>
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: () => setCollapsed(!collapsed),
        })}
        <div style={{ float: 'right' }}>
          <span>欢迎<span style={{"color":"red"}}>{username}</span>回来</span>
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
export default WithRouter(TopHeader)