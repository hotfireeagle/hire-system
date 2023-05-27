/**
 * 角色列表数据
 */
import { PageContainer } from "@ant-design/pro-components"
import { Button, Card } from "antd"
import { history } from "@umijs/max"
import SearchList from "@/components/searchList"

const RoleList = () => {
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
        return <a href="#">查看详情</a>
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
        >
          <Button onClick={jumpToNewRolePage} type="primary">新增角色</Button>
        </SearchList>
      </Card>
    </PageContainer>
  )
}

export default RoleList