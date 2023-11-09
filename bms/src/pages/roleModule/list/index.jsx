/**
 * 角色列表数据
 */
import { PageContainer } from "@ant-design/pro-components"
import { Button, Card, message, Popconfirm } from "antd"
import { history } from "@umijs/max"
import SearchList from "@/components/searchList"
import { useState } from "react"
import request from "@/utils/request"

const RoleList = () => {
  const [reload, setReload] = useState(false)

  const roleTableColumns = [
    {
      title: "角色",
      dataIndex: "name",
    },
    {
      title: "描述",
      dataIndex: "desc",
    },
    {
      title: "操作",
      dataIndex: "id",
      render: v => {
        const seeDetail = event => {
          event.preventDefault()
          const detailUrl = `/permissionModule/role/detail/${v}`
          history.push(detailUrl)
        }

        const delRoleHandler = event => {
          event.preventDefault()
          request(`/permission/role/delete/${v}`, {}, "get").then(() => {
            message.success("删除成功")
            setReload(!reload)
          })
        }

        return (
          <div>
            <a style={{ marginRight: 15 }} onClick={seeDetail} href="#">查看详情</a>
            <Popconfirm
              title="提示"
              description="确认删除吗?"
              onConfirm={delRoleHandler}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </div>
        )
      }
    }
  ]

  const jumpToNewRolePage = () => {
    history.push("/permissionModule/role/new")
  }

  return (
    <PageContainer>
      <Card>
        <SearchList
          url="/permission/role/list"
          tableColumns={roleTableColumns}
          needReload={reload}
        >
          <Button onClick={jumpToNewRolePage} type="primary">新增角色</Button>
        </SearchList>
      </Card>
    </PageContainer>
  )
}

export default RoleList