import { Card, message, Button } from "antd"
import SearchList from "@/components/searchList"
import { renderImgInTable, renderSomeLineWithTooltip } from "@/utils/ui"
import { converTimeForApi } from "@/utils/tool"
import ModalForm from "@/components/modalForm"
import { useState } from "react"
import request from "@/utils/request"

const BannerModule = () => {
  const [reloadList, setReloadList] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [activeBanner, setActiveBanner] = useState({}) // 想要进行修改操作的banner对象

  const bannerColumns = [
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
      render: renderSomeLineWithTooltip,
    },
    {
      title: "上下线时间",
      dataIndex: "id",
      render: (v, obj) => {
        return <div>[{obj.online_time}, {obj.offline_time}]</div>
      },
    },
    {
      title: "操作",
      dataIndex: "id",
      render: (val, obj) => {
        const editHandler = event => {
          event.preventDefault()
          setActiveBanner(obj)
        }

        return (
          <div>
            <a onClick={editHandler} href="#">修改</a>
            <a onClick={event => deleteBannerHandler(event, val)} href="#">删除</a>
          </div>
        )
      }
    }
  ]

  const bark = () => {
    message.success("操作成功")
    setReloadList(!reloadList)
  }

  const editFormList = [
    {
      label: "图片",
      key: "url",
      type: "input",
      required: true,
    },
    {
      label: "跳转链接",
      key: "jumpUrl",
      type: "input",
      required: true,
    },
    {
      label: "上下线时间",
      key: "times",
      type: "datePickers",
      required: true,
    }
  ]

  const checkIsEditBanner = () => !!activeBanner.id

  const clickOkHandler = values => {
    const postData = {
      ...(activeBanner || {}),
      ...values,
    }
    converTimeForApi(postData, "onlineTime", "offlineTime", "times")
    let url = "/banner/new"
    if (checkIsEditBanner()) {
      url = "/banner/update"
    }
    return request(url, postData, "post").then(bark)
  }

  // 删除banner的处理方法
  const deleteBannerHandler = (event, bannerId) => {
    event.preventDefault()
    request(`/banner/delete/${bannerId}`, {}, "get").then(bark)
  }

  return (
    <Card>
      <SearchList
        url="/banner/list"
        tableColumns={bannerColumns}
        needReload={reloadList}
      >
        <Button onClick={() => setShowModal(true)} type="primary">新增banner</Button>
      </SearchList>

      <ModalForm
        title={checkIsEditBanner() ? "修改banner" : "新增banner"}
        visible={showModal}
        formList={editFormList}
        onOk={clickOkHandler}
        onCancel={() => setShowModal(false)}
      />
    </Card>
  )
}

export default BannerModule