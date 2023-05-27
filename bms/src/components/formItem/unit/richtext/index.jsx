import "braft-editor/dist/index.css"
import BraftEditor from "braft-editor"
import PropTypes from "prop-types"
import { bfUploadFn } from "../../../../utils/utils"

const RichText = props => {
  const changeInputHandler = obj => {
    props.onChange(obj)
  }

  // 自己只会接收到字符串值
  const returnInputVal = () => {
    const v = props.value || ""
    if (typeof v === "string") {
      return BraftEditor.createEditorState(v)
    }
    return v
  }

  return (
    <BraftEditor
      contentStyle={{ border: "1px solid #d9d9d9", borderTopStyle: "none" }}
      excludeControls={["emoji", "clear", "blockquote", "code"]}
      onChange={val => changeInputHandler(val)}
      media={{ uploadFn: bfUploadFn }}
      value={returnInputVal()}
      disabled={props.disabled}
    />
  )
}

RichText.propTypes = {
  disabled: PropTypes.bool, // 是否需要禁止选择
  value: PropTypes.any, // 值
  onChange: PropTypes.func, // 值修改的时候触发
}

export default RichText