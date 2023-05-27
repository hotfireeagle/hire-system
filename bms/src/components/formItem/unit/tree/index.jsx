import { Tree } from "antd"
import PropTypes from "prop-types"

const TreeElem = props => {
  return (
    <Tree
      checkable
      fieldNames={props.fieldNames}
      treeData={props.list}
      checkedKeys={props.value}
      onCheck={props.onChange}
      defaultExpandAll={props.defaultExpandAll}
      disabled={props.disabled}
    />
  )
}

TreeElem.propTypes = {
  fieldNames: PropTypes.object,
  list: PropTypes.array, // 树列表数据
  value: PropTypes.any, // 选中的值
  onChange: PropTypes.func, // 值改变的回调
  defaultExpandAll: PropTypes.bool, // 是否默认展开
  disabled: PropTypes.bool, // 是否禁止修改
}

export default TreeElem