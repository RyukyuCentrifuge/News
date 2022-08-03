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


class Token {
  constructor() {
    this.isLogin = undefined
    this.rights = undefined
    this.roleType = undefined
    // 类自调用获取token
    this.#getToken()
    if (this.isLogin) {
      const { role: { rights, roleType } } = this.isLogin
      this.rights = rights
      this.roleType = roleType
    }
  }

  #getToken () {
    this.isLogin = JSON.parse(localStorage.getItem('token'))
  }

  checkRoute (val) {
    return LocalRouterMap[val.key] && (val.pagepermisson || val.routepermisson)
  }
  checkPermission (val) {
    if (this.roleType === 1) {
      return this.rights.checked?.includes(val.key)
    } else {
      return this.rights.includes(val.key)
    }
  }
}

// 这里是第一版时代码 会导致第一次登录无法正常显示页面
//#region 
/* const isLogin = localStorage.getItem('token')
if (isLogin) {
  const { role: { rights, roleType } } = JSON.parse(localStorage.getItem("token"))

  checkRoute = (val) => {
    return LocalRouterMap[val.key] && (val.pagepermisson || val.routepermisson)
  }
  checkPermission = (val) => {
    if (roleType === 1) {
      return rights.checked?.includes(val.key)
    } else {
      return rights.includes(val.key)
    }
  }
} */
//#endregion

// const token = new Token() // 在这里调用会导致第一次登录无法正常显示页面

let checkRoute = null, checkPermission = null
const getList = (BackRouteList) => {
  if (BackRouteList.length > 0) {
    const token = new Token()
    let list = BackRouteList.map(val => {
      let configureList
      checkRoute = token.isLogin && token.checkRoute(val)
      checkPermission = token.isLogin && token.checkPermission(val)
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