import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader, notification } from 'antd';
import withRouter from '../../components/WithRouter';
import axios from 'axios'
import { HeartTwoTone } from '@ant-design/icons';
import moment from 'moment';
function Preview (props) {
  let [newsObj, setNewsObj] = useState(null)
  let [num, setnum] = useState(0)
  useEffect(() => {
    axios.get(`/news/${props.history.match.id}?_expand=category&_expand=role`).then(res => {
      setNewsObj({
        ...res.data,
        view: res.data.view + 1
      })
      // 同步后端
      return res.data
    }).then((res) => {
      axios.patch(`/news/${props.history.match.id}`, {
        view: res.view + 1
      })
    })
  }, [props.history.match.id])


  const handleStar = () => {
    console.log(num);
    if (num > 0) return openNotification('top')
    setNewsObj({
      ...newsObj,
      star: newsObj.star + 1
    })
    axios.patch(`/news/${props.history.match.id}`, {
      star: newsObj.view + 1
    })
    setnum(num + 1)
  }

  const openNotification = (placement) => {
    notification.info({
      message: `提示`,
      description: '已经点过一次赞了，无法再次点赞',
      placement,
    });
  };

  return (
    <div>
      {
        newsObj && <div>
          <PageHeader
            onBack={() => window.history.back()}
            title={newsObj.title}
            subTitle={
              <div>
                {newsObj.category.title}
                <HeartTwoTone
                  twoToneColor="#eb2f96"
                  style={{ paddingLeft: '20px' }}
                  onClick={() => handleStar()}
                />
              </div>
            }
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">{newsObj.author}</Descriptions.Item>
              <Descriptions.Item label="区域">{newsObj.region}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{newsObj.publishTime ? moment(newsObj.publishTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
              <Descriptions.Item label="访问数量">{newsObj.view}</Descriptions.Item>
              <Descriptions.Item label="点赞数量">{newsObj.star}</Descriptions.Item>
              <Descriptions.Item label="评论数量">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>
          {/* 固定格式，用于解析后端返回来的富文本 */}
          <div dangerouslySetInnerHTML={{
            __html: newsObj.content
          }} style={{
            padding: "0 24px"
          }}>
          </div>
        </div>
      }
    </div>
  )
}
export default withRouter(Preview)