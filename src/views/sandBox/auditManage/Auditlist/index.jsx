import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Button, Tag } from 'antd'
import { EditOutlined } from '@ant-design/icons'
export default function AuditList(props) {
  const [dataSource,setDataSource] = useState([])
  const {username} = JSON.parse(localStorage.getItem('token'))
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/newsSand/newsmanage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ['black', 'orange', 'green', 'red']
        const auditTitle = ['未审核', '审核中', '已通过', '未通过']
        return <Tag color={colorList[auditState]}>{auditTitle[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        const buttonTitle = ["",'撤销','发布','修改']
        return (
          <div>
            <Button type='primary'>{buttonTitle[item.auditState]}</Button>
          </div>
        )
      }
    }
  ]
  useEffect(()=>{
    /* 
      ne  不等于
      lte  小于
      jte  大于
    */
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res=>{
      console.log(res.data);
      setDataSource(res.data)
    })
  },[username])
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
    </div>
  )
}
