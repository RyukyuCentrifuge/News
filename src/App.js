import React from 'react'
import IndexRouter from './router/IndexRouter'
import './App.css'
import './util/http'
import { Provider } from 'react-redux'
import store from './redux/store'
export default function App() {
  return (
    <Provider store={store}>
      <IndexRouter></IndexRouter>
    </Provider>
    
  )
}
