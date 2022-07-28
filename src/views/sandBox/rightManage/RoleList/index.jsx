import { Table, Button, Modal, Tree } from 'antd'
import React, { useState, useEffect } from 'react'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal
export default function Rolelist () {
  const [dataSource, setDataSource] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [rightList, setRightList] = useState([])
  const [currnetRight,setCurrentRight] = useState([])
  const [currnetId,setCurrentId] = useState(0)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}></Button>
            <Button type='primary' shape='circle' icon={<EditOutlined />} onClick={() => {
              setIsModalVisible(true)
              setCurrentRight(item.rights)
              setCurrentId(item.id)
            }}></Button>
          </div>
        )
      }
    }
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
    if (item.grade === 1) {
      setDataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/roles/${item.id}`)
    }
  }

  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      setRightList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('/roles').then(res => {
      setDataSource(res.data)
    })
  }, [])

  const handleOk = () => {
    setIsModalVisible(false)
    setDataSource(dataSource.map(item=>{
      if(item.id === currnetId){
        return {
          ...item,
          rights:currnetRight
        }
      }
      return item
    }))
    axios.patch(`/roles/${currnetId}`,{
      rights:currnetRight
    })
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const onCheck = (checkedKeys) => {
    setCurrentRight(checkedKeys)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
      <Modal title='权限分配' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          onCheck={onCheck}
          checkStrictly = {true}
          checkedKeys={currnetRight}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
