import { combineReducers } from "redux";

import CollApsedReducer from './CollapsedReducer'
import LoadingReducer from './LoadingReducer'

// 汇总所有reducer
export default combineReducers({
  CollApsedReducer,
  LoadingReducer
})