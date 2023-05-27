/**
 * 用封装FormItem的ui部分
 */
import {
  Form,
  Space,
} from "antd"
import {
  DatePicker,
  Input,
  Select,
  Row,
  Col,
  InputNumber,
  Checkbox,
  Radio,
  Cascader,
  TreeSelect,
  Button,
  Switch,
} from "antd"
const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons"
import PermissionDFSTree from "./unit/permissionTree"

const { SHOW_PARENT } = TreeSelect
const type = {
  input: "请输入",
  select: "请选择",
}
//校验
const rules = (item) => {
  let rules = []
  if (item.required) {
    const labelType = typeof item.label
    let defaultHelp
    if (labelType == "string") {
      defaultHelp = `${type[item.type] || "请输入"}${item.label}`
    } else {
      defaultHelp = `${type[item.type] || "请输入"}`
    }
    let message = item.message || item?.placeholder || defaultHelp
    rules.push({ required: true, message })
  }
  if (item.rules && item.rules.length) {
    rules = rules.concat(item.rules)
  }
  return rules
}

//输入框
const inputElem = (v, form) => {
  const maxLength = v?.maxLength || Number.MAX_SAFE_INTEGER
  const valueChangeHandler = (event) => {
    if (v.valCb) {
      v.valCb(event.target.value)
    }
  }
  return (
    <RenderShell v={v} form={form} key={v.key}>
      <Input
        style={{ height: v?.h, width: v?.w, ...v.style }}
        placeholder={v?.placeholder || `请输入${v?.label}`}
        allowClear
        disabled={v?.disabled}
        suffix={v?.suffix}
        maxLength={maxLength}
        onChange={valueChangeHandler}
        addonBefore={v?.addonBefore}
        addonAfter={v?.addonAfter}
      />
    </RenderShell>
  )
}

// 地区选择器
const cascaderElem = (v, form) => {
  const filter = (inputValue, path) =>
    path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    )
  return (
    <RenderShell v={v} form={form} key={v.key}>
      <Cascader
        options={v.oplist}
        showSearch={{
          filter
        }}
        placeholder={v?.placeholder || `请选择${v?.label}`}
        fieldNames={{ label: "label", value: "value", children: "children" }}
        disabled={v?.disabled}
      />
    </RenderShell>
  )
}

const textElem = (v, form) => {
  const SpanUI = (props) => {
    return <span>{v.value || props.value}</span>
  }
  return (
    <RenderShell v={v} form={form} key={v.key}>
      <SpanUI />
    </RenderShell>
  )
}

//密码输入框
const passwordInputElem = (v, form) => {
  return (
    <RenderShell v={v} form={form} key={v.key}>
      <Input.Password
        style={{ height: v?.h, width: v?.w, ...v.style }}
        placeholder={v?.placeholder || `请输入${v?.label}`}
        allowClear
        disabled={v?.disabled}
        suffix={v?.suffix}
      />
    </RenderShell>
  )
}

//多选框
const checkboxElem = (v, form) => {
  return (
    <RenderShell v={v} form={form} key={v.key}>
      <Checkbox.Group
        disabled={v?.disabled}
        style={{ height: v?.h, width: v?.w, ...v.style }}
        options={v?.oplist}
      />
    </RenderShell>
  )
}

const radioElem = (v, form) => {
  const opl = v?.oplist || []
  const needVertical = v?.needVertical || false // 是否垂直排列

  const childRender = () => {
    return (
      <>
        {opl.map((obj, idx) => (
          <Radio key={idx} value={obj.value}>
            {obj.name}
          </Radio>
        ))}
      </>
    )
  }
  //初始化函数
  const init = () => {}
  return (
    <RenderShell v={v} form={form} key={v.key}>
      <Radio.Group disabled={v?.disabled} onChange={v?.cb || init}>
        {needVertical ? (
          <Space direction="vertical">{childRender()}</Space>
        ) : (
          <>{childRender()}</>
        )}
      </Radio.Group>
    </RenderShell>
  )
}

//多行输入框
const textAreaElem = (v, form) => {
  const maxLen = v.maxLength || Number.MAX_SAFE_INTEGER
  return (
    <RenderShell v={v} form={form} key={v.key}>
      <TextArea
        disabled={v?.disabled}
        style={{ height: v?.h, width: v?.w, ...v.style }}
        placeholder={v?.placeholder || `请输入${v?.label}`}
        rows={v?.rows || 4}
        maxLength={maxLen}
        showCount={v?.showCount || false}
      />
    </RenderShell>
  )
}

// 数字输入框
const inputNumberElem = (v, form) => {
  const minVal = v.min || 0
  const maxVal = v.max != undefined ? v.max : Number.MAX_SAFE_INTEGER

  const formatter = v.formatter || ((v) => v)
  const parser = v.parser || ((v) => v)

  return (
    <RenderShell v={v} form={form} key={v.key}>
      <InputNumber
        disabled={v?.disabled}
        style={{ height: v?.h, width: v?.w, ...v.style }}
        placeholder={v?.placeholder || `请输入${v?.label}`}
        min={minVal}
        max={maxVal}
        formatter={formatter}
        parser={parser}
        precision={v?.precision}
        addonBefore={v?.addonBefore}
        addonAfter={v?.addonAfter}
      />
    </RenderShell>
  )
}

//选择框
const selectElem = (v, form) => {
  //初始化函数
  const init = () => {}
  return (
    <RenderShell v={v} form={form} key={v.key}>
      <Select
        mode={v.mode}
        allowClear
        placeholder={v?.placeholder || `请选择${v?.label}`}
        style={{ height: v?.h, width: v?.w, ...v.style }}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        showSearch={true || v?.search} // 固定可搜索
        disabled={v?.disabled}
        onChange={v?.cb || init}
      >
        {v.oplist &&
          v.oplist.map((opitem, val) => (
            <Option
              value={opitem[v.opk || "value"]}
              key={val}
              disabled={opitem.disabled}
            >
              {opitem[v.opv || "name"]}
            </Option>
          ))}
      </Select>
    </RenderShell>
  )
}
//Switch
const switchElem = (v, form) => {
  return (
    <Col span={!form?.flex ? v?.span || form?.span : false}>
      <Form.Item
        label={v?.label}
        {...v?.formItemLayout}
        name={
          form.formItemKey === 0 || form.formItemKey
            ? [form.formItemKey, v.key]
            : v.key
        }
        rules={rules(v)}
        initialValue={v?.initV || undefined}
        required={v?.required}
        valuePropName="checked"
      >
        <Switch
          disabled={v?.disabled}
          checkedChildren={v?.checkedChildren || "开"}
          unCheckedChildren={v?.unCheckedChildren || "关"}
        />
      </Form.Item>
    </Col>
  )
}

//自定义
const customElem = (v, form) => {
  return (
    <RenderShell v={v} form={form} key={v.key ? v.key : v.render}>
      {v.render(v)}
    </RenderShell>
  )
}

//时间选择
const rangePickerElem = (v, form) => {
  return (
    <RenderShell v={v} form={form} key={v.key}>
      <RangePicker
        disabled={v?.disabled}
        allowClear
        placeholder={v?.placeholder || `请选择${v?.label}`}
        style={{ height: v?.h, width: v?.w, ...v.style }}
        showTime={v.showTime}
      />
    </RenderShell>
  )
}
//时间单选择
const datePickerElem = (v, form) => {
  return (
    <RenderShell v={v} form={form} key={v.key}>
      <DatePicker
        disabled={v?.disabled}
        allowClear
        placeholder={v?.placeholder || `请选择${v?.label}`}
        style={{ height: v?.h, width: v?.w, ...v.style }}
        showTime
      />
    </RenderShell>
  )
}
//TreeSelect
const treeSelectElem = (v, form) => {
  return (
    <RenderShell v={v} form={form} key={v.key}>
      <TreeSelect
        disabled={v?.disabled}
        allowClear
        placeholder={v?.placeholder || `请选择${v?.label}`}
        style={{ height: v?.h, width: v?.w, ...v.style }}
        treeData={v?.treeData}
        showCheckedStrategy={SHOW_PARENT}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        fieldNames={v?.fieldNames}
        filterTreeNode={(inputValue, treeNode) =>
          treeNode.name.indexOf(inputValue) > -1
        }
      />
    </RenderShell>
  )
}
//item壳子
const RenderShell = ({ v, form, children }) => {
  return (
    <Col span={!form?.flex ? v?.span || form?.span : false}>
      <Form.Item
        label={v?.label}
        {...v?.formItemLayout}
        name={
          form.formItemKey === 0 || form.formItemKey
            ? [form.formItemKey, v.key]
            : v.key
        }
        rules={rules(v)}
        initialValue={v?.initV}
        required={v?.required}
        tooltip={v?.tooltip}
      >
        {children}
      </Form.Item>
    </Col>
  )
}
// Form.List
const renderFormList = (v, { span, flex }) => {
  return (
    <Col span={!flex ? v?.span || span : false} key={v.key}>
      <Form.Item label={v?.label} {...v?.formItemLayout} required={v?.required}>
        <Form.List
          name={v?.key}
          initialValue={v?.initV || undefined}
          rules={rules(v)}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map((fieldsItem, idx) => {
                let itemList = v.itemList
                if (v.initV[idx] && v.initV[idx][v.disabledKey]) {
                  itemList = v.itemList.map((item) => {
                    item.disabled = true
                    return item
                  })
                } else {
                  itemList = v.itemList.map((item) => {
                    item.disabled = false
                    return item
                  })
                }
                return (
                  <Space
                    key={fieldsItem.key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <div>
                      {renderFormItem(itemList, {
                        span,
                        flex,
                        formItemKey: idx,
                      })}
                    </div>
                    {v.initV[idx] && !v.initV[idx]["remove"] ? null : (
                      <MinusCircleOutlined onClick={() => remove(idx)} />
                    )}
                  </Space>
                )
              })}

              {fields.length < (v?.max || 3) && (
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    新增
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
      </Form.Item>
    </Col>
  )
}

const permissionTreeElem = (v, form) => {
  const apl = v?.list || []; // 当前角色所拥有的所有权限
  return (
    <RenderShell v={v} form={form} key={v.key}>
      <PermissionDFSTree allPermissionList={apl} />
    </RenderShell>
  )
}

const renderFormItem = (list, form) => {
  if (!list?.length) return
  let formList = []
  list.map((item) => {
    if (item.hide) {
      return
    } else {
      if (item.type === "permissionTree") {
        // 权限联动穿梭框组件
        formList.push(permissionTreeElem(item, form))
      }
      if (item.type === "input") {
        formList.push(inputElem(item, form))
      }
      if (item.type === "password") {
        formList.push(passwordInputElem(item, form))
      }
      if (item.type === "numberInput") {
        formList.push(inputNumberElem(item, form))
      }
      if (item.type === "select") {
        formList.push(selectElem(item, form))
      }
      if (item.type === "custom") {
        formList.push(customElem(item, form))
      }
      if (item.type === "datePickers") {
        formList.push(rangePickerElem(item, form))
      }
      if (item.type === "textArea") {
        formList.push(textAreaElem(item, form))
      }
      if (item.type === "datePicker") {
        formList.push(datePickerElem(item, form))
      }
      if (item.type === "checkbox") {
        formList.push(checkboxElem(item, form))
      }
      if (item.type === "radio") {
        formList.push(radioElem(item, form))
      }
      if (item.type === "text") {
        formList.push(textElem(item, form))
      }
      if (item.type === "cascader") {
        formList.push(cascaderElem(item, form))
      }
      if (item.type === "list.item") {
        // Form.List
        formList.push(renderFormList(item, form))
      }
      if (item.type === "treeSelect") {
        // 树形选择器
        formList.push(treeSelectElem(item, form))
      }
      if (item.type === "switch") {
        // 开关
        formList.push(switchElem(item, form))
      }
    }
  })
  return formList
}

export const FormItem = ({ list, getFieldDecorator, span = 8, flex = false }) => {
  return (
    <Row type={flex ? "flex" : undefined}>
      {renderFormItem(list, { getFieldDecorator, span, flex })}
    </Row>
  )
}
