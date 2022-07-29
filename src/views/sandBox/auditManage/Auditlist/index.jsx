import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Button, Tag, notification } from 'antd'
import withRouter from '../../../../components/WithRouter'
function AuditList(props) {
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
            <Button type='primary' onClick={()=>newsAction(item)}>{buttonTitle[item.auditState]}</Button>
          </div>
        )
      }
    }
  ]
  const newsAction = (item) =>{
    switch(item.auditState){
      case 1:
        setDataSource(dataSource.filter(data=>data.id!==item.id))
        axios.patch(`/news/${item.id}`,{
          auditState: 0
        }).then(res=>{
          notification.info({
            message: '通知',
            description: `您可以到草稿箱中查看您的新闻`,
            placement: "bottomRight"
          })
        })
        break;
      case 2:
        axios.patch(`/news/${item.id}`,{
          "publishState": 2,
          "publishTime": new Date().now()
        }).then(res=>{
          notification.info({
            message: '通知',
            description: `您可以到【发布管理/已发布】中查看您的新闻`,
            placement: "bottomRight"
          })
        })
        break;
      case 3:
        props.history.push(`/newsSand/newsmanage/update/${item.id}`)
        break;
      default:
        break
    }
  }
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

export default withRouter(AuditList)
