import React from 'react'
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './index.css'
import ParticlesBg from 'particles-bg'
import axios from 'axios';
import withRouter from '../../components/WithRouter';
function Login (props) {
  const onFinish = (value) => {
    axios.get(`/users?username=${value.username}&password=${value.password}&roleState=true&_expand=role`).then(res=>{
      if(res.data.length===0){
        message.error('用户名或密码不匹配')
      }else{
        localStorage.setItem('token',JSON.stringify(res.data[0]))
        props.history.push('/')
      }
    })
  }
  return (
    <div style={{ 'backgroundColor': "rgba(35,39,65)", "height": "100%" }}>
      <div className='formContainer'>
        <div className='logintitle'>全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
      <ParticlesBg type="circle" bg={{position:'absolute',zIndex:0}} />
    </div>
  )
}
export default withRouter(Login)