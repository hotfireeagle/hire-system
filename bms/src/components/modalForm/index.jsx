import { Button, Form } from "antd"
import { Modal } from "antd" // 用antd版本的modal的话，弹窗只能打开，但是不能关闭
import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import { FormItem } from "../formItem"

const defaultFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
}

const ModalForm = (props) => {
  const [formInstance] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  // 当表单默认值控制props发生变化时，更新到form表单上
  useEffect(() => {
    const obj = props.initValue || {}
    formInstance.setFieldsValue(obj)
  }, [props.initValue])

  const okHandler = async () => {
    try {
      setSubmitting(true)
      const values = await formInstance.validateFields()
      await props.onOk(values)
      //自动关闭弹窗
      if (!props.onOkUnAutoCloseModal) {
        cancelHandler()
      }
    } catch (err) {
    } finally {
      setSubmitting(false)
    }
  }
  const cancelHandler = () => {
    formInstance.resetFields()
    props.onCancel()
  }
  //把formInstance抛出去给父组件
  useEffect(() => {
    if (props.getFormInstance) props?.getFormInstance(formInstance)
  }, [])

  const formItemLayout = props.formItemLayout || defaultFormItemLayout

  return (
    <Modal
      title={props.title}
      open={props.visible}
      onOk={okHandler}
      onCancel={cancelHandler}
      width={props.width || 600}
      className={props.className}
      okButtonProps={{
        loading: submitting,
        disabled: submitting,
      }}
      footer={[
        props.footer ? props.footer() : null,
        <Button key="back" onClick={cancelHandler}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={submitting}
          onClick={okHandler}
        >
          确定
        </Button>,
      ]}
    >
      <Form {...formItemLayout} form={formInstance}>
        <FormItem list={props.formList} span={24} />
      </Form>
    </Modal>
  )
}

ModalForm.propTypes = {
  title: PropTypes.string, // 模态窗的标题
  visible: PropTypes.bool, // 模态窗是否可见
  onOk: PropTypes.func, // 点击模态窗的确认方法时触发
  onCancel: PropTypes.func, // 点击模态窗的取消方法时触发
  formList: PropTypes.array, // 模态窗的form表单配置项
  initValue: PropTypes.object, // form表单的默认值
  width: PropTypes.number, // 模态窗的宽度
  formItemLayout: PropTypes.object, // form表单的布局配置
  onOkUnAutoCloseModal: PropTypes.bool, //确定后是否不需要自动关闭弹窗
}

export default ModalForm
