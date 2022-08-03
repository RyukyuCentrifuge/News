import Mylazy from './lazyLoad'
import { Navigate } from 'react-router-dom'
const LocalRouterMap = {
  "/newsSand/home": {
    path: "home",
    element: Mylazy('sandBox/home')
  },
  // "/newsSand/rightManage": {
  //   path: "rightManage",
  //   element: Mylazy('sandBox/rightManage')
  // },
  "/newsSand/rightManage/rightList": {
    path: "rightManage/rightList",
    element: Mylazy('sandBox/rightManage/RightList')
  },
  "/newsSand/rightManage/roleList": {
    path: "rightManage/roleList",
    element: Mylazy('sandBox/rightManage/RoleList')
  },
  "/newsSand/usermanage": {
    path: "usermanage",
    element: Mylazy('sandBox/userManage')
  },
  // "/newsSand/newsmanage": {
  //   path: 'newsmanage',
  //   element: Mylazy('sandBox/newsmanage')
  // },
  "/newsSand/newsmanage/add": {
    path: 'newsmanage/add',
    element: Mylazy('sandBox/newsmanage/AddList')
  },
  "/newsSand/newsmanage/draft": {
    path: 'newsmanage/draft',
    element: Mylazy('sandBox/newsmanage/DraftList')
  },
  "/newsSand/newsmanage/category": {
    path: 'newsmanage/category',
    element: Mylazy('sandBox/newsmanage/Category')
  },
  "/newsSand/newsmanage/preview/:id": {
    path: 'newsmanage/preview/:id',
    element: Mylazy('sandBox/newsmanage/Preview')
  },
  "/newsSand/newsmanage/update/:id": {
    path: 'newsmanage/update/:id',
    element: Mylazy('sandBox/newsmanage/Update')
  },
  // "/newsSand": {
  //   path: 'auditmanage',
  //   element: Mylazy('sandBox/auditManage')
  // },
  // "/newsSand/auditmanage": {
  //   path: 'auditmanage',
  //   element: Mylazy('sandBox/auditManage')
  // },
  "/newsSand/auditmanage/audit": {
    path: 'auditmanage/audit',
    element: Mylazy('sandBox/auditManage/Audit')
  },
  "/newsSand/auditmanage/list": {
    path: 'auditmanage/list',
    element: Mylazy('sandBox/auditManage/Auditlist')
  },
  // "/newsSand/publishmanage": {
  //   path: 'publishmanage',
  //   element: Mylazy('sandBox/publishManage')
  // },
  "/newsSand/publishmanage/unpublished": {
    path: 'publishmanage/unpublished',
    element: Mylazy('sandBox/publishManage/Unpbulished')
  },
  "/newsSand/publishmanage/published": {
    path: 'publishmanage/published',
    element: Mylazy('sandBox/publishManage/Published')
  },
  "/newsSand/publishmanage/sunset": {
    path: 'publishmanage/sunset',
    element: Mylazy('sandBox/publishManage/Subset')
  }
}

const getToken = (val) => {
  const isLogin = JSON.parse(localStorage.getItem('token'))
  if (isLogin) {
    const { role: { rights, roleType } } = JSON.parse(localStorage.getItem("token"))
    function checkRoute () {
      return LocalRouterMap[val.key] && (val.pagepermisson || val.routepermisson)
    }
    let checkPermission = () => {
      if (roleType === 1) {
        return rights.checked?.includes(val.key)
      } else {
        return rights.includes(val.key)
      }
    }
    return {
      checkRoute,
      checkPermission
    }
  }
}


const getList = (BackRouteList) => {
  if (BackRouteList.length > 0) {
    let list = BackRouteList.map(val => {
      let configureList
      const token = getToken(val)
      const checkRoute = token?.checkRoute(val)
      const checkPermission = token?.checkPermission(val)
      if (checkRoute && checkPermission) {
        configureList = {
          path: LocalRouterMap[val.key] && LocalRouterMap[val.key].path,
          element: LocalRouterMap[val.key] && LocalRouterMap[val.key].element
        }
      }
      return configureList
    });
    let newList = list.filter(item => {
      return item !== undefined
    })
    let supplementList = [
      {
        path: '',
        element: <Navigate to='/newsSand/home' />
      },
      {
        path: '*',
        element: Mylazy('notFount'),
      },
    ]

    list = [...newList, ...supplementList]
    return list
  }
}

export default getList