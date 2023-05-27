/**
 * 角色列表数据
 */
import { PageContainer } from "@ant-design/pro-components"
import TablePro from "@/components/tablePro"

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

  return (
    <PageContainer>
      <TablePro
        url="/permission/role/list"
        columns={roleTableColumns}
      />
    </PageContainer>
  )
}

export default RoleList