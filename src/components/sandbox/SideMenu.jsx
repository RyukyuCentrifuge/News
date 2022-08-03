import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import '../index.css'
import WithRouter from '../../components/WithRouter'
import axios from 'axios';
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const { Sider } = Layout;
function SideMenu (props) {
  const navgate = useNavigate()
  const [menuList, setMenuList] = useState([])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      setMenuList(res.data)
    })
  }, [])

  const token = localStorage.getItem('token')
  if(!token) return navgate('/login')  // 没有token，则直接跳转到login页  这是防止直接删除token报错

  const { role: { rights, roleType } } = JSON.parse(localStorage.getItem('token'))

  function getItem (label, key, children, type) {
    return {
      key,
      children,
      label,
      type,
    };
  }
  
  const myitem = (data) => {
    if (data) {
      return (data.map(val => {
        if (roleType === 1) {
          if (rights.checked?.includes(val.key)) {
            if (val.pagepermisson !== 1) {
              return false
            }
            return getItem(val.title, val.key, val.children?.length !== 0 && rights.checked?.includes(val.key) ? myitem(val.children) : null)
          }
        } else {
          if (rights.includes(val.key)) {
            if (val.pagepermisson !== 1) {
              return false
            }
            return getItem(val.title, val.key, val.children?.length !== 0 && rights.includes(val.key) ? myitem(val.children) : null)
          }
        }
        return null
      }))
    }
  }
  const items = myitem(menuList)
  
  function changehandle (item) {
    if (item.key === window.location.pathname) {
      return
    }
    props.history.push(item.key)
  }
  const slectKeys = [props.history.location.pathname]
  const openKeys = props.history.location.pathname === '/newsSand/home' ? [''] : ['/' + props.history.location.pathname.split('/').slice(1, -1).join('/')]
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: 'flex', height: '100%', "flexDirection": "column" }}>
        <div className="logo" >全球新闻发布管理系统</div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu
            defaultOpenKeys={openKeys}
            theme="dark"
            mode="inline"
            selectedKeys={slectKeys}
            items={items}
            onClick={changehandle}
          />
        </div>
      </div>
    </Sider>
  )
}

const mapStateToProps = ({CollApsedReducer:{isCollapsed}})=>{
  return {
    isCollapsed
  }
}
export default connect(mapStateToProps)(WithRouter(SideMenu))