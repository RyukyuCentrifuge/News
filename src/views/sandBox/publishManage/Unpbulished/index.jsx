
import PublishList from '../../../../components/sandbox/publishManage/PublishList'
import usePublish from '../../../../components/sandbox/publishManage/usePublish'
import { Button } from 'antd'
export default function Unpbuilshed () {
  const { dataSource, newsAction } = usePublish(1)
  return (
    <div>
      <PublishList 
        dataSource={dataSource} 
        button={(id) => <Button type='primary' onClick={() => newsAction(id, 1)}>发布</Button>}>
      </PublishList>
    </div>
  )
}