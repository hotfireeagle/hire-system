import { Form } from "antd"
import {DatePicker} from "antd"

export const DatePickerSchemaUI = ({ schema }) => {
  return (
    <Form.Item
      label={schema.label}
      name={schema.key}
      initialValue={schema.initialValue || undefined}
      style={{ marginBottom: "10px" }}
    >
      <DatePicker format="YYYY-MM-DD" disabledDate={schema.disabledDate || (() => false)} />
    </Form.Item>
  )
}
