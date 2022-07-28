import React, { useEffect, useRef, useState } from 'react'
import { Button, PageHeader, Steps, Form, Input, Select, message, notification, } from 'antd';
import style from './index.module.css'
import axios from 'axios'
import NewEditor from '../../../../components/newsManage/NewsEditor'
import { useNavigate } from 'react-router-dom';
const { Step } = Steps;
const {Option} = Select
export default function AddList (props) {
  const [current, setCurrent] = useState(0)
  const [categorieList,setCategorieList] = useState([])
  const NewsForm = useRef(null)
  const [formInfo,setFormInfo] = useState({})
  const [content,setContent] = useState('')
  const navgate = useNavigate()
  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };
  const handleNext = () => {
    if(current === 0){
      console.log(NewsForm.current);
      NewsForm.current.validateFields().then(res=>{
        setCurrent(current + 1)
        setFormInfo(res)
      }).catch(err=>{
        console.log(err);
      })
    }else{
      if(content === '' || content.trim()==='<p></p>'){
        message.error("新闻内容不能为空")
      }else{
        setCurrent(current + 1)
      }
    }
  }

  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  const User = JSON.parse(localStorage.getItem('token'))

  useEffect(()=>{
    axios.get('/categories').then(res=>{
      setCategorieList(res.data)
    })
  },[])
  
  const handleSave = (type) =>{
    axios.post('/news',{
      ...formInfo,
      "content":content,
      "region":User.region?User.region : '全球',
      "author":User.username,
      "roleId":User.roleId,
      "auditState":type,
      "publishState":0,
      "createTime":Date.now(),
      "star":0,
      "view":0,
      // "publishTime":0
    }).then(res=>{
      navgate(type===0?'/newsSand/newsmanage/draft':'/newsSand/auditmanage/list')
      notification.info({
        message:'通知',
        description:`您可以到${type===0?'草稿箱':'审核列表'}中查看您的新闻`,
        placement:"bottomRight"
      })
    })
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      <div style={{ "marginTop": "50px" }}>
        <div className={current === 0 ? '' : style.active}>
          <Form {...layout} name="control-hooks" ref={NewsForm}>
            <Form.Item
              name="title"
              label="新闻标题"
              rules={[
                {
                  required: true,
                  message: '请输入新闻标题'
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="categoryId"
              label="新闻分类"
              rules={[
                {
                  required: true,
                  message: '请选择新闻标题'
                },
              ]}
            >
              <Select>
                {
                  categorieList.map(val=>{
                    return <Option value={val.id} key={val.id}>{val.title}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : style.active}>
          <NewEditor getContent={(value)=>{
            setContent(value)
          }}></NewEditor>
        </div>
        <div className={current === 2 ? '' : style.active}>
          
        </div>
      </div>

      <div style={{ "marginTop": "50px" }}>
        {
          current === 2 && <span>
            <Button type='primary' onClick={()=>handleSave(0)}>保存草稿箱</Button>
            <Button danger onClick={()=>handleSave(1)}>提交审核</Button>
          </span>
        }
        {
          current < 2 && <Button type='primary' onClick={() => handleNext()}>下一步</Button>
        }
        {
          current > 0 && <Button onClick={() => handlePrevious()}>上一步</Button>
        }

      </div>
    </div>
  )
}
