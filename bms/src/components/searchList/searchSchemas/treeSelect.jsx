/**
 * treeSelect形式组件
 */
import { Form } from "antd"
import { TreeSelect } from "antd"
import PropTypes from "prop-types"

export const TreeSelectSchemaUI = ({ schema }) => {
  return (
    <Form.Item
      label={schema.label}
      name={schema.key}
      initialValue={schema.initialValue || undefined}
    >
      <TreeSelect
        {...schema}
      />
    </Form.Item>
  )
}

TreeSelectSchemaUI.propTypes = {
  schema: PropTypes.object, // 数据建模对象
}
