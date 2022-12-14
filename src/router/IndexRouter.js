import React, { useEffect, useState } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import Mylazy from './lazyLoad'
import AuthComponent from './AuthComponents'
import SandBox from '../views/sandBox'
import axios from 'axios'
import getList from './Dynamic'
export default function IndexRouter () {
  const [BackRouteList, setBackRouteList] = useState([])

  useEffect(() => {
    Promise.all([
      axios.get('/rights'),
      axios.get('/children')
    ]).then(res => {
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  }, [])

  const element = useRoutes([
    {
      path: '/login',
      element: Mylazy('login'),
    },
    {
      path: '/news',
      element: Mylazy('news/News'),
    },
    {
      path: '/detail/:id',
      element: Mylazy('news/Detail'),
    },
    {
      path: '/newsSand',
      element: <SandBox />,  // 这里必须是这么写，否则在路由跳转的时候会出现闪烁
      children: getList(BackRouteList)
    },
    {
      path: '/',
      element: <AuthComponent>
        <Navigate to='/newsSand' />
      </AuthComponent>
    },
    {
      path: '*',
      element: Mylazy('notFount'),
    }
  ])
  return (
    element
  )
}
