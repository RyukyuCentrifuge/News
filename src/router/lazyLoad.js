import React, { lazy } from "react"
const Mylazy = (path) => {
  const Comp = lazy(() => import(`../views/${path}`))
  return (
    <React.Suspense>
        <Comp />
    </React.Suspense>
  )
}
export default Mylazy