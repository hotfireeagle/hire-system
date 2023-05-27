import {  Form } from "antd"
import { DatePicker} from "antd"
const { RangePicker } = DatePicker

export const RangePickerSchemaUI = ({ schema }) => {
  return (
    <Form.Item
      label={schema.label}
      name={schema.key}
      initialValue={schema.initialValue || undefined}
      style={{ marginBottom: "10px" }}
    >
      <RangePicker />
    </Form.Item>
  )
}
