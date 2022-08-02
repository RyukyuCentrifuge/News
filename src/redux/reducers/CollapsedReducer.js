import { CHANGECOLLAPSED } from '../constant'
const initState = {
  isCollapsed: false
}
const CollApsedReducer = (preState = initState, action) => {
  const { type } = action
  switch (type) {
    case CHANGECOLLAPSED:
      let newState = {...preState};
      newState.isCollapsed = !newState.isCollapsed
      return newState
    default:
      return preState
  }
}
export default CollApsedReducer