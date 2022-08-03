import { legacy_createStore } from "redux";
import { persistReducer, persistStore } from 'redux-persist'
import storage from "redux-persist/lib/storage";
import reducers from "./reducers";

const persistConfig = {
  key: 'root',
  storage,
  blacklist:['LoadingReducer'], // 不会保存LoadingReducer
}
// 持久化处理
const persistedReducer = persistReducer(persistConfig, reducers)
const store = legacy_createStore(persistedReducer)
const persistor = persistStore(store)
export { store, persistor }