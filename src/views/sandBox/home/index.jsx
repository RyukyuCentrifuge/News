import React from 'react'
import { Button } from 'antd'
import axios from 'axios'
export default function Home() {
  const getData = () =>{
    axios.get('http://localhost:8000/posts').then(res=>{
      console.log(res);
    })
  }
  return (
    <div>
      <Button type='primary' onClick={getData}>点击</Button>
    </div>
  )
}
