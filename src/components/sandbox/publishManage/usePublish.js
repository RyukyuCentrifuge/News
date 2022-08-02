// 自定义hook
import { useEffect, useState } from 'react'
import axios from 'axios'
import { notification } from 'antd'
function usePublish (type) {
  const [dataSource, setdataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
      setdataSource(res.data)
    })
  }, [username, type])


  const newsAction = (id,type) => {
    switch (type) {
      case '1': // 发布
      case 1:
        axios.patch(`/news/${id}`, {
          "publishState": 2,
        }).then(res => {
          if(res.status === 200){
            setdataSource(dataSource.filter(data => data.id !== id))
            notification.info({
              message: '通知',
              description: `您可以到【发布管理/已发布】中查看您的新闻`,
              placement: "bottomRight"
            })
          }
        })
        break;
      case '2':
      case 2: // 下线
        axios.patch(`/news/${id}`, {
          "publishState": 3,
        }).then(res => {
          if(res.status === 200){
            setdataSource(dataSource.filter(data => data.id !== id))
            notification.info({
              message: '通知',
              description: `您可以到【发布管理/已下线】中查看您的新闻`,
              placement: "bottomRight"
            })
          }
        })
        break;
      case '3':
      case 3: // 删除
        setdataSource(dataSource.filter(data => data.id !== id))
        axios.delete(`/news/${id}`)
        break;
      default:
        break
    }
  }

  return {
    dataSource,
    newsAction
  }
}

export default usePublish