import React, { lazy } from "react"
import Loading from '../components/Loading'
const Mylazy = (path) => {
  const Comp = lazy(() => import(`../views/${path}`))
  return (
    <React.Suspense fallback={<Loading />}>
      <Comp />
    </React.Suspense>
  )
}
export default Mylazy 