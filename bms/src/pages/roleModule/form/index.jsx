import { PageContainer } from "@ant-design/pro-components"
import { FormItem } from "@/components/formItem"
import { Form, Card, Button, Row, Col, message } from "antd"
import { useFetch } from "@/hooks/useFetch"
import request from "@/utils/request"
import { useParams } from "umi"
import { useState, useEffect } from "react"
import Btn from "@/components/btn"

const RoleForm = () => {
  const paramsObj = useParams()
  const [formInstance] = Form.useForm()
  const [loading, permissionTree] = useFetch([], "/permission/tree")
  const [detailData, setDetailData] = useState({})
  const [reloadDetail, setReloadDetail] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const checkIsSeeDetail = () => !!paramsObj.id

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
    const postData = {
      ...(detailData || {}),
      ...values,
    }
    let url = "/permission/role/new"
    if (checkIsSeeDetail()) {
      url = "/permission/role/update"
    }
    request(url, postData).then(() => {
      message.success("操作成功")
      if (checkIsSeeDetail()) {
        setReloadDetail(!reloadDetail)
        return
      }
      history.back()
    })
  }

  useEffect(() => {
    if (!checkIsSeeDetail()) {
      return
    }
    setLoadingDetail(true)
    request(`/permission/role/detail/${paramsObj.id}`, {}, "get").then(res => {
      setDetailData(res)
      formInstance.setFieldsValue(res)
    }).finally(() => {
      setLoadingDetail(false)
    })
  }, [reloadDetail])

  return (
    <PageContainer>
      <Card loading={loading || loadingDetail}>
        <Form {...formItemLayout} form={formInstance}>
          <FormItem
            list={detailForm}
            span={24}
          />
          <Row>
            <Col offset={formItemLayout.labelCol.span}>
              <Btn
                onClick={submitHandler}
                type="primary"
                text="提交"
                throttleTime={1000}
              />
            </Col>
          </Row>
        </Form>
      </Card>
    </PageContainer>
  )
}

export default RoleForm