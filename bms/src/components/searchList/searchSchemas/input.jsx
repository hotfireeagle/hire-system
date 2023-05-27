/**
 * 渲染input形式的搜索条件
 */
import { Form } from "antd"
import { Input } from 'antd'
import PropTypes from "prop-types"

export const InputSchemaUI = ({ schema }) => {
  const width = schema.w || 140
  return (
    <Form.Item
      label={schema.label}
      name={schema.key}
      initialValue={schema.initialValue || undefined}
      style={{ marginBottom: "10px" }}
    >
      <Input
        allowClear
        placeholder="请输入"
        maxLength={schema?.maxLength}
        style={{ width }}
      />
    </Form.Item>
  )
}

InputSchemaUI.propTypes = {
  schema: PropTypes.object, // 数据建模
}
