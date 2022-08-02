import { CHANGELOADING } from '../constant'
const initState = {
  isLoading: true
}
const LoadingReducer = (preState = initState, action) => {
  const { type,payload } = action
  switch (type) {
    case CHANGELOADING:
      let newState = {...preState};
      newState.isLoading = payload
      return newState
    default:
      return preState
  }
}
export default LoadingReducer