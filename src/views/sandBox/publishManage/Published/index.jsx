import PublishList from '../../../../components/sandbox/publishManage/PublishList'
import usePublish from '../../../../components/sandbox/publishManage/usePublish'
import { Button } from 'antd'
export default function Published () {
  const { dataSource, newsAction } = usePublish(2)
  return (
    <div>
      <PublishList 
        dataSource={dataSource}
        button={(id) => <Button type='primary' onClick={() => newsAction(id, 2)}>下线</Button>}>
      </PublishList>
    </div>
  )
}