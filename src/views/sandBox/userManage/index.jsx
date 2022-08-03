import React, { useEffect, useRef, useState } from 'react'
import { Button, Table, Modal, Switch } from 'antd';
import axios from 'axios';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/sandbox/UserForm';
const { confirm } = Modal
export default function UserList () {
  const [dataSource, setDataSource] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const [isUpdata, setIsUpdata] = useState(false)
  const [isUpdataDisabled, setIsUpdataDisabled] = useState(false)
  const [current, setcurrent] = useState(null)
  const addForm = useRef()
  const updataForm = useRef()
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))

  // 分级别展示当前用户及当前用户之下管理的其他用户

  useEffect(() => {
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }
    axios.get('/users?_expand=role').then(res => {
      console.log(res.data);
      const list = res.data
      setDataSource(roleObj[roleId] === 'superadmin' ? list : [
        ...list.filter(item => item.username === username || (item.region === region && roleObj[item.roleId] === 'editor')),
        // ...list.filter(item => )
      ])
    })
  }, [roleId, region, username])

  // 区域
  useEffect(() => {
    axios.get('/regions').then(res => {
      const list = res.data
      setRegionList(list)
    })
  }, [])

  // 角色
  useEffect(() => {
    axios.get('/roles').then(res => {
      const list = res.data
      setRoleList(list)
    })
  }, [])
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: '全球',
          value: ''
        }
      ],
      onFilter: (value, item) => item.region === value,
      render: (region) => {
        if (region === '') {
          return '全球'
        } else {
          return region
        }
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        if (role) {
          return role.roleName
        }

      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default}></Button>
            <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdata(item)}></Button>
          </div>
        )
      }
    },
  ]

  const confirmMethod = (item) => {
    confirm({
      title: "您确定要删除？",
      icon: <ExclamationCircleOutlined />,
      onOk () {
        deleteMethod(item)
      },
      onCancel () {
        console.log('取消');
      }
    })
  }

  function deleteMethod (item) {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }

  function handleChange (item) {
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }

  async function handleUpdata (item) {
    await setIsUpdata(true)
    if (item.roleId === 1) {
      await setIsUpdataDisabled(true)
    } else {
      await setIsUpdataDisabled(false)
    }
    await updataForm.current.setFieldsValue(item)
    setcurrent(item)
  }

  // 添加用户
  const addRoleList = () => {
    addForm.current.validateFields().then(res => {
      setIsVisible(false)
      addForm.current.resetFields()
      axios.post(`/users`, {
        ...res,
        "roleState": true,
        "default": false
      }).then(res => {
        // 这里是为了让不刷新页面就显示出来角色名称
        setDataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === res.data.roleId)[0]
        }])

        addForm.current.setFieldsValue({
          region: '',
          password: '',
          username: '',
          roleId: ''
        })
      })
    }).catch(err => {
      console.log(err);
    })
  }

  // 更新用户
  const UpdataRoleList = () => {
    updataForm.current.validateFields().then(res => {
      setIsUpdata(false)
      setDataSource(dataSource.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...res,
            role: roleList.filter(data => data.id === res.roleId)[0]
          }
        }
        return item
      }))
      setIsUpdataDisabled(!isUpdataDisabled)
      axios.patch(`/users/${current.id}`, res)
    })
  }

  return (
    <div>
      <Button type='primary' onClick={() => { setIsVisible(true) }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize: 5
      }} rowKey={item => item.id} />
      <Modal
        visible={isVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => { setIsVisible(false) }}
        onOk={() => { addRoleList() }}
      >
        <UserForm ref={addForm} regionList={regionList} roleList={roleList}></UserForm>
      </Modal>

      <Modal
        visible={isUpdata}
        title="更新用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsUpdata(false)
          setIsUpdataDisabled(!isUpdataDisabled)
        }}
        onOk={() => { UpdataRoleList() }}
      >
        <UserForm ref={updataForm} regionList={regionList} roleList={roleList} isUpdataDisabled={isUpdataDisabled} isUpdata={true}></UserForm>
      </Modal>
    </div>
  )
}
