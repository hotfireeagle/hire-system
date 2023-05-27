/**
 * 角色列表数据
 */
import { PageContainer } from "@ant-design/pro-components"
import TablePro from "@/components/tablePro"
import { Button } from "antd"
import { history } from "@umijs/max"

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
      <TablePro
        url="/permission/role/list"
        columns={roleTableColumns}
      >
        <Button onClick={jumpToNewRolePage} type="primary">新增角色</Button>
      </TablePro>
    </PageContainer>
  )
}

export default RoleList