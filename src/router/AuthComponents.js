import { Navigate } from "react-router-dom"

function AuthComponent({children}){
  const isLogin = localStorage.getItem('token')
  return isLogin ? children : <Navigate to='/login' />
}
export default AuthComponent