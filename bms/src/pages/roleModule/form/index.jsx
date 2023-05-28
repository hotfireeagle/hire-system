import { PageContainer } from "@ant-design/pro-components"
import { FormItem } from "@/components/formItem"
import { Form, Card, Button, Row, Col } from "antd"
import { useFetch } from "@/hooks/useFetch"

const RoleForm = () => {
  const [formInstance] = Form.useForm()
  const [loading, permissionTree] = useFetch([], "/permission/tree")

  const detailForm = [
    {
      label: "角色名称",
      key: "name",
      type: "input",
      required: true,
    },
    {
      label: "角色描述",
      key: "desc",
      type: "textArea",
      required: true,
    },
    {
      label: "权限",
      key: "permissions",
      type: "permissionTree",
      list: permissionTree,
      required: true,
    }
  ]

  const formItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 8 },
  }

  const submitHandler = async () => {
    const values = await formInstance.validateFields()
    console.warn("values is >>>>", values)
  }

  return (
    <PageContainer>
      <Card loading={loading}>
        <Form {...formItemLayout} form={formInstance}>
          <FormItem
            list={detailForm}
            span={24}
          />
          <Row>
            <Col offset={formItemLayout.labelCol.span}>
              <Button onClick={submitHandler} type="primary">提交</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </PageContainer>
  )
}

export default RoleForm