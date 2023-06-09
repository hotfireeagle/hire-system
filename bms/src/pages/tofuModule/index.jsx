import { PageContainer } from "@ant-design/pro-components"
import { Card, Table, Button, message } from "antd"
import ModalForm from "@/components/modalForm"
import { useState, useEffect } from "react"
import { renderImgInTable } from "@/utils/ui"
import request from "@/utils/request"
import styles from "./index.less"

const leftPosition = "left"
const rightTopPosition = "rightTop"
const rightBottomPosition = "rightBottom"

const TofuModule = () => {
  const [cubes, setCubes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [activeTofu, setActiveTofu] = useState({})
  const [reload, setReload] = useState(false)
  const [newPosition, setNewPosition] = useState(null)

  const tableClumns = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "图片",
      dataIndex: "url",
      render: renderImgInTable,
    },
    {
      title: "跳转链接",
      dataIndex: "jumpUrl",
    },
    {
      title: "操作",
      dataIndex: "id",
      render: (_, obj) => {
        const clickHandler = event => {
          event.preventDefault()
          setActiveTofu(obj)
          setShowModal(true)
        }

        return (
          <div>
            <a onClick={clickHandler} href="#">修改</a>
          </div>
        )
      }
    }
  ]

  const schema = [
    {
      label: "图片",
      type: "upload",
      key: "url",
      required: true,
    },
    {
      label: "跳转链接",
      type: "input",
      key: "jumpUrl",
      required: true,
    }
  ]

  const checkIsEditToFu = () => !!activeTofu.id

  const clickNew = clickPosition => {
    setNewPosition(clickPosition)
    setActiveTofu({})
    setShowModal(true)
  }

  const returnTableDataSource = key => {
    const findItem = cubes.find(obj => obj.position == key)
    if (findItem) {
      return [findItem]
    }
    return []
  }
  
  const modalOkHandler = values => {
    const postData = {
      ...(activeTofu || {}),
      ...values,
    }
    let url = "/configure/tofucube/new"
    if (checkIsEditToFu()) {
      url = "/configure/tofucube/update"
    } else {
      postData.position = newPosition
    }
    request(url, postData, "post").then(() => {
      message.success("操作成功")
      setReload(!reload)
    })
  }

  useEffect(() => {
    request("/configure/tofucube/list", {}, "get").then(list => {
      setCubes(list || [])
    })
  }, [reload])

  return (
    <PageContainer>
      <Card title="左边" className={styles.mb15}>
        <Button
          onClick={() => clickNew(leftPosition)}
          disabled={returnTableDataSource(leftPosition).length}
          type="primary"
          className={styles.mb15}
        >
          新增
        </Button>
        <Table
          rowKey="id"
          columns={tableClumns}
          dataSource={returnTableDataSource(leftPosition)}
          pagination={false}
        />
      </Card>

      <Card title="右上" className={styles.mb15}>
        <Button
          onClick={() => clickNew(rightTopPosition)}
          disabled={returnTableDataSource(rightTopPosition).length}
          type="primary"
          className={styles.mb15}
        >
          新增
        </Button>
        <Table
          rowKey="id"
          columns={tableClumns}
          dataSource={returnTableDataSource(rightTopPosition)}
          pagination={false}
        />
      </Card>

      <Card title="右下">
        <Button
          onClick={() => clickNew(rightBottomPosition)}
          disabled={returnTableDataSource(rightBottomPosition).length}
          type="primary"
          className={styles.mb15}
        >
          新增
        </Button>
        <Table
          rowKey="id"
          columns={tableClumns}
          dataSource={returnTableDataSource(rightBottomPosition)}
          pagination={false}
        />
      </Card>

      <ModalForm
        title={checkIsEditToFu() ? "编辑豆腐块" : "新增豆腐块"}
        visible={showModal}
        formList={schema}
        onOk={modalOkHandler}
        onCancel={() => {
          setShowModal(false)
          setNewPosition(null)
          setActiveTofu({})
        }}
        initValue={activeTofu}
      />
    </PageContainer>
  )
}

export default TofuModule