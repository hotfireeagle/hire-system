/**
 * 成员列表页面
 */
import { PageContainer } from "@ant-design/pro-components"
import { Button, Card } from "antd"
import { history } from "@umijs/max"
import SearchList from "@/components/searchList"

const AccountList = () => {
  const accountTableColumns = [
    {
      title: "成员账号",
      dataIndex: "email",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
    },
    {
      title: "操作",
      dataIndex: "id",
      render: v => {
        const seeDetail = event => {
          event.preventDefault()
          const detailUrl = `/permissionModule/account/detail/${v}`
          history.push(detailUrl)
        }
        return <a onClick={seeDetail} href="#">查看详情</a>
      }
    }
  ]

  const jumpToNewRolePage = () => {
    history.push("/permissionModule/account/new")
  }

  return (
    <PageContainer>
      <Card>
        <SearchList
          url="/permission/account/list"
          tableColumns={accountTableColumns}
        >
          <Button onClick={jumpToNewRolePage} type="primary">新增成员</Button>
        </SearchList>
      </Card>
    </PageContainer>
  )
}

export default AccountList