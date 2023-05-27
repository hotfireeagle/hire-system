/**
 * 渲染input形式的搜索条件
 */
import { Form } from "antd"
import {InputNumber } from "antd"
import PropTypes from "prop-types"

export const NumberInputSchemaUI = ({ schema }) => {
  return (
    <Form.Item
      label={schema.label}
      name={schema.key}
      initialValue={schema.initialValue || undefined}
      style={{ marginBottom: "10px" }}
    >
      <InputNumber placeholder="请输入" style={{ width: 140 }} />
    </Form.Item>
  )
}

NumberInputSchemaUI.propTypes = {
  schema: PropTypes.object, // 数据建模
}
 