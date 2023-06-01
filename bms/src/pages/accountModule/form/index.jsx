/**
 * 成员详情页面
 */
import { PageContainer } from "@ant-design/pro-components"
import { FormItem } from "@/components/formItem"
import { Form, Card, Row, Col, message, notification, Button } from "antd"
import { useFetch } from "@/hooks/useFetch"
import request from "@/utils/request"
import { useParams } from "umi"
import { useState, useEffect } from "react"
import Btn from "@/components/btn"

const AccountForm = () => {
  const paramsObj = useParams()
  const [formInstance] = Form.useForm()
  const [loading, allRoles] = useFetch([], "/permission/role/all", {}, "get")
  const [detailData, setDetailData] = useState({})
  const [reloadDetail, setReloadDetail] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const checkIsSeeDetail = () => !!paramsObj.accountId

  const detailForm = [
    {
      label: "成员账号",
      key: "email",
      type: "input",
      required: true,
      disabled: checkIsSeeDetail(), // 成员账号不可进行修改
    },
    {
      label: "角色",
      key: "roles",
      type: "select",
      required: true,
      oplist: allRoles,
      opk: "id",
      opv: "name",
      mode: "multiple",
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
    let url = "/permission/account/new"
    if (checkIsSeeDetail()) {
      url = "/permission/account/update"
    }
    request(url, postData).then(maybePassword => {
      message.success("操作成功")
      if (checkIsSeeDetail()) {
        setReloadDetail(!reloadDetail)
        return
      } else {
        // 提示密码
        notification.success({
          message: "密码",
          description: maybePassword,
          duration: null,
        })
      }
      history.back()
    })
  }

  const resetPasswordHandler = () => {
    request("/permission/account/resetPassword", {}, "get").then(newPassword => {
      notification.success({
        message: "密码",
        description: newPassword,
        duration: null,
      })
    })
  }

  const returnResetPasswordBtn = () => {
    return (
      <Button onClick={resetPasswordHandler} type="primary">重置密码</Button>
    )
  }

  useEffect(() => {
    if (!checkIsSeeDetail()) {
      return
    }
    setLoadingDetail(true)
    request(`/permission/account/detail/${paramsObj.accountId}`, {}, "get").then(res => {
      setDetailData(res)
      formInstance.setFieldsValue(res)
    }).finally(() => {
      setLoadingDetail(false)
    })
  }, [reloadDetail])

  return (
    <PageContainer>
      <Card
        loading={loading || loadingDetail}
        extra={returnResetPasswordBtn()}
      >
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

export default AccountForm