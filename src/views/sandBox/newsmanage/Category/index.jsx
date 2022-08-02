import React, { useEffect, useState, useContext, useRef } from 'react'
import { Button, Form, Input, Table, Modal } from 'antd';
import axios from 'axios';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal
const EditableContext = React.createContext(null);
export default function NewCategory () {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get('/categories').then(res => {

      setDataSource(res.data)
    })
  }, [])
  const defaultColumns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      editable: true,
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}></Button>
          </div>
        )
      }
    },
  ]

  const confirmMethod = (item) => {
    confirm({
      title: "您确定要删除？",
      icon: <ExclamationCircleOutlined />,
      onOk () {
        deleteMethod(item)
      },
      onCancel () {
        console.log('取消');
      }
    })
  }

  function deleteMethod (item) {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/categories?${item.id}`)
  }


  // 可编辑单元格功能
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title}不能为空`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };


  // 重新遍历表头
  const columns = defaultColumns.map((col) => {
    // 遍历源表头，看是否拥有editable属性，如果没有，则还是原来的样子，否则变为可编辑单元格
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const handleSave = (row) => {
    // // 将所有源数据遍历到一个新数组中
    // const newData = [...dataSource];
    // // 获取当前要修改的下标
    // const index = newData.findIndex((item) => row.key === item.key);
    // // 获取要修改的哪一行数据
    // const item = newData[index];
    // console.log(item.value);
    // // 将修改的数据进行替换，并插入原来的数据   官网写法会报错，如果更新第二条及以下数据，会导致key值错误
    // newData.splice(index, 1, { ...item, ...row });
    const newData = dataSource.map(item=>{
      if(item.id === row.id){
        return {
          id:item.id,
          title:row.title,
          value:row.title
        }
      } 
      // 如果当前修改的那一行id与循环的id不一致，则返回原来的数据
      return item
    })
    setDataSource(newData);

    axios.patch(`/categories/${row.id}`,{
      title:row.title,
      value:row.title
    })
  };

  // 定制可编辑行
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <div>
      <Table dataSource={dataSource} components={components} columns={columns} pagination={{
        pageSize: 5
      }} rowKey={(item) => item.id} />
    </div>
  )
}
