import { PageContainer } from "@ant-design/pro-components"
import { Card, message, Button } from "antd"
import SearchList from "@/components/searchList"
import { renderImgInTable, renderSomeLineWithTooltip } from "@/utils/ui"
import { convertTimeForApi, convertTimeToShow, convertApiTimeForUI } from "@/utils/tool"
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
      title: "显示时间",
      dataIndex: "id",
      render: (v, obj) => {
        return <div>[{convertTimeToShow(obj.onlineTime)}, {convertTimeToShow(obj.offlineTime)}]</div>
      },
    },
    {
      title: "操作",
      dataIndex: "id",
      render: (val, obj) => {
        const editHandler = event => {
          event.preventDefault()
          convertApiTimeForUI(obj, "onlineTime", "offlineTime") // 对时间做一个处理
          setActiveBanner(obj)
          setShowModal(true)
        }

        return (
          <div>
            <a style={{ marginRight: 15 }} onClick={editHandler} href="#">修改</a>
            <a onClick={event => deleteBannerHandler(event, val)} href="#">删除</a>
          </div>
        )
      }
    }
  ]

  const searchColumns = [
    {
      label: "状态",
      key: "status",
      type: "select",
      initialValue: 1,
      oplist: [
        { name: "展示中", value: 1, },
        { name: "已过期", value: 2, },
        { name: "未到期", value: 3, },
      ],
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
      w: "100%",
    }
  ]

  const checkIsEditBanner = () => !!activeBanner.id

  const clickOkHandler = values => {
    const postData = {
      ...(activeBanner || {}),
      ...values,
    }
    convertTimeForApi(postData, "onlineTime", "offlineTime", "times")
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
    <PageContainer>
      <Card>
        <SearchList
          url="/banner/list"
          tableColumns={bannerColumns}
          needReload={reloadList}
          searchSchema={searchColumns}
        >
          <Button onClick={() => setShowModal(true)} type="primary">新增banner</Button>
        </SearchList>

        <ModalForm
          title={checkIsEditBanner() ? "修改banner" : "新增banner"}
          visible={showModal}
          formList={editFormList}
          onOk={clickOkHandler}
          onCancel={() => setShowModal(false)}
          initValue={activeBanner}
        />
      </Card>
    </PageContainer>
  )
}

export default BannerModule