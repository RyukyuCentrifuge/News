
import PublishList from '../../../../components/sandbox/publishManage/PublishList'
import usePublish from '../../../../components/sandbox/publishManage/usePublish'
import { Button } from 'antd'
export default function Subset () {
  const { dataSource, newsAction } = usePublish(3)
  return (
    <div>
      <PublishList 
        dataSource={dataSource}
        button={(id) => <Button type='primary' onClick={() => newsAction(id, 3)}>删除</Button>}>
      </PublishList>
    </div>
  )
}