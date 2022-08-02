import React from 'react'
import withRouter from '../../WithRouter'
import { Table } from 'antd'
function PublishList (props) {
  const { dataSource, button } = props
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
      title: '操作',
      render: (item) => {
        return (
          <div>
            {button(item.id)}
          </div>
        )
      }
    }
  ]

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize: 5
      }} rowKey={(item) => item.id}></Table>
    </div>
  )
}

export default withRouter(PublishList)