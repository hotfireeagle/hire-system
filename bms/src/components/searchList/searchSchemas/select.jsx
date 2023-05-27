/**
 * 渲染input形式的搜索条件
 */
 import { Form } from "antd"
 import { Select} from "antd"
 import PropTypes from "prop-types"
 
 const { Option } = Select
 
 export const SelectSchemaUI = ({ schema }) => {
   return (
     <Form.Item
       label={schema.label}
       name={schema.key}
       initialValue={schema.initialValue || undefined}
     >
       <Select
         allowClear
         placeholder="请选择"
         style={{ width: schema.w || 140, marginBottom: "10px" }}
         filterOption={(input, option) =>
           option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
         }
         showSearch={true}
         mode={schema?.mode}
       >
         {schema.oplist &&
           schema.oplist.map((itemOpt, val) => (
             <Option value={itemOpt[schema.opk || "value"]} key={val}>
               {itemOpt[schema.opv || "name"]}
             </Option>
           ))}
       </Select>
     </Form.Item>
   )
 }
 
 SelectSchemaUI.propTypes = {
   schema: PropTypes.object, // 数据建模对象
 }
 