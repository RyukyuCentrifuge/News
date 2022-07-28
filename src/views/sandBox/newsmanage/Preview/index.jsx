import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader } from 'antd';
import withRouter from '../../../../components/WithRouter';
import axios from 'axios'
import moment from 'moment';
function Preview (props) {
  let [newsObj, setNewsObj] = useState(null)
  useEffect(() => {
    // console.log(props.history.match.id);
    axios.get(`/news/${props.history.match.id}?_expand=category&_expand=role`).then(res => {
      console.log(res.data);
      setNewsObj(res.data)
    })
  }, [props.history.match.id])

  const auditState = ['未审核','审核中','已通过','未通过']
  const publishState = ['未发布','待发布','已上线','已下线']
  return (
    <div>
      {
        newsObj && <div>
          <PageHeader
            onBack={() => window.history.back()}
            title={newsObj.title}
            subTitle={newsObj.category.title}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">{newsObj.author}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{moment(newsObj.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{newsObj.publishTime ? moment(newsObj.publishTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
              <Descriptions.Item label="区域">{newsObj.region}</Descriptions.Item>
              <Descriptions.Item label="审核状态">{auditState[newsObj.auditState]}</Descriptions.Item>
              <Descriptions.Item label="发布状态">{publishState[newsObj.publishState]}</Descriptions.Item>
              <Descriptions.Item label="访问数量">{newsObj.view}</Descriptions.Item>
              <Descriptions.Item label="点赞数量">{newsObj.star}</Descriptions.Item>
              <Descriptions.Item label="评论数量">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>
          {/* 固定格式，用于解析后端返回来的富文本 */}
          <div dangerouslySetInnerHTML={{
            __html:newsObj.content
          }} style={{
            padding:"0 24px"
          }}>
          </div>
        </div>
      }
    </div>
  )
}
export default withRouter(Preview)