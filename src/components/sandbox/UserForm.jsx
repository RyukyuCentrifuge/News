import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd';
const { Option } = Select
const UserForm = forwardRef((props, ref) => {
  const [isDisabled, setIsDisabled] = useState(false)
  useEffect(() => {
    setIsDisabled(props.isUpdataDisabled)
  }, [props.isUpdataDisabled])
  const { roleId, region } = JSON.parse(localStorage.getItem("token"))
  const roleObj = {
    "1": "superadmin",
    "2": "admin",
    "3": "editor"
  }
  const checkRegionDiabled = (item) => {
    if (props.isUpdate) {
      if (roleObj[roleId] === "superadmin") {
        return false
      } else {
        return true
      }
    } else {
      if (roleObj[roleId] === "superadmin") {
        return false
      } else {
        return item.value !== region
      }
    }
  }
  const checkRoleDiabled = (item) => {
    if (props.isUpdate) {
      if (roleObj[roleId] === "superadmin") {
        return false
      } else {
        return true
      }
    } else {
      if (roleObj[roleId] === "superadmin") {
        return false
      } else {
        return roleObj[item.id] !== "editor"
      }
    }
  }
  return (
    <div>
      <Form
        ref={ref}
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '必须输入用户名', },]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '必须输入密码', },]}
        >
          <Input />
        </Form.Item>
        {/* 如果选择的角色是超级管理员，不用必须选择区域，否则，则提示 */}
        <Form.Item
          name="region"
          label="区域"
          rules={isDisabled ? [] : [{ required: true, message: '必须选择区域', },]}
        >
          <Select disabled={isDisabled}>
            {
              props.regionList.map(item => {
                return <Option value={item.value} key={item.id} disabled={checkRegionDiabled(item)}>{item.title}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色"
          rules={[{ required: true, message: '必须选择区域', },]}
        >
          <Select onChange={(value) => {
            if (value === 1) {
              ref.current.setFieldsValue({
                region: ''
              })
              setIsDisabled(true)
            } else {
              setIsDisabled(false)
            }
          }}>
            {
              props.roleList.map(item => {
                return <Option value={item.id} key={item.id} disabled={checkRoleDiabled(item)}>{item.roleName}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Form>
    </div>
  )
})
export default UserForm