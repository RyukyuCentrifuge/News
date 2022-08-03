import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, PieChartOutlined, BarChartOutlined } from '@ant-design/icons';
import axios from 'axios'
import * as echarts from 'echarts';
// 高性能数据处理方式
import _ from 'lodash'
const { Meta } = Card;
export default function Home () {
  const [browseList, getbrowseList] = useState([])
  const [starList, getstarList] = useState([])
  const [allList, getallList] = useState([])
  const [visible, setVisible] = useState(false);
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  const [pieChart, setpieChart] = useState(null)
  const barRef = useRef()
  const pieRef = useRef()
  useEffect(() => {
    /* 
      _sort  根据什么排序
      _order 根据何种方式排序 desc 反向（从大到小）
      _limit  显示多少条
    */
    Promise.all([
      axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`),
      axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`)
    ]).then(res => {
      getbrowseList(res[0].data)
      getstarList(res[1].data)
    })
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
      readerBar(_.groupBy(res.data, item => item.category.title))
      getallList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])

  const readerBar = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [{
        name: '数量',
        type: 'bar',
        data: Object.values(obj).map(item => item.length)
      }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize = () => {
      myChart.resize()
    }
  }

  const readerPie = (obj) => {
    // 数据处理工作
    var currentList = allList.filter(item => item.author === username)
    var groupObj = _.groupBy(currentList, item => item.category.title)
    var list = []
    for (var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }
    var myChart;
    if (!pieChart) {
      myChart = echarts.init(pieRef.current);
      setpieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option;

    option = {
      title: {
        text: '当前用户新闻分类图示',
        // subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title={
            <div>
              <span>用户最常浏览</span>
              <BarChartOutlined style={{ paddingLeft: '20px' }} />
            </div>
          } bordered={true}>
            <List
              size="small"
              dataSource={browseList}
              renderItem={(item) => <List.Item>
                <a href={`#/newsSand/newsmanage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={
            <div>
              <span>用户点赞最多</span>
              <BarChartOutlined style={{ paddingLeft: '20px' }} />
            </div>
          } bordered={true}>
            <List
              size="small"
              dataSource={starList}
              renderItem={(item) => <List.Item>
                <a href={`#/newsSand/newsmanage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <PieChartOutlined onClick={async () => {
                await setVisible(true);
                await readerPie()
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  <span style={{
                    paddingLeft: '30px'
                  }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <Drawer width='500px' title="个人新闻分类" placement="right" onClose={onClose} visible={visible}>
        <div ref={pieRef} style={{
          width: '100%',
          height: '500px',
          marginTop: '30px'
        }}></div>
      </Drawer>

      <div ref={barRef} style={{
        height: '500px',
        marginTop: '30px'
      }}></div>
    </div>
  )
}
