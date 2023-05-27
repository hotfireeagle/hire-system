/**
 * 省市级联选择组件
 * 做成Cascader的话，如果不做额外修改的话，由于Cascade只能映射成一个字段，如果是省市的话，那么自然也就是第二级 市。
 * 如果想要利用Cascader实现全省的效果的话，那么可以在第二级手动加一个 “所有市” 的处理。
 * 
 * 考虑到之前已入库展位都要么是省、要么是市的code；并不存在这个这次引入的所有市的code + 方便筛选，如果传参的code不能确定
 * 到底是省code，还是市code（注：整个组件映射成一个字段输出的话，那么后端筛选时就需要判断这个code到底是省，还是市，然后再去匹配数据）
 * 
 * 所以这里直接处理成两个Select即可
 */
import { useState, useEffect } from "react"
import provinceDict from "../utils/province.json"
import cityList from "../utils/cityDict"
import { Form } from "antd"
import { Select} from "antd"

const provinceList = provinceDict.RECORDS || []
const selectStyle = { width: 114 }

export const ProvinceAndCity = ({ schema, formInstance }) => {
  const [showCityList, setShowCityList] = useState([])

  // 监听省份变化，当省份变化时，设置对应的城市列表，重置必要的数据
  const changeProvinceHandler = provinceCode => {
    formInstance.resetFields([schema.cityKey]) // 重置城市
    const hitCitys = cityList.filter(obj => obj.PROVINCE_CODE == provinceCode)
    setShowCityList(hitCitys)
  }

  // 默认省份的值发生变化时，进行相应的重置以及城市列表初始化工作
  useEffect(() => {
    formInstance.resetFields([schema.cityKey]) // 重置城市
    const hitCitys = cityList.filter(obj => obj.PROVINCE_CODE == schema.initialProvinceValue)
    setShowCityList(hitCitys)
  }, [schema.initialProvinceValue])

  if (!schema.provinceKey || !schema.cityKey) {
    console.error("error accurs")
    return <p>schema缺少provinceKey、cityKey</p>
  }

  return (
    <>
      <Form.Item
        label={schema.label}
        name={schema.provinceKey}
        initialValue={schema.initialProvinceValue}
        style={{ marginBottom: "10px" }}
      >
        <Select
          placeholder="请选择省份"
          style={selectStyle}
          options={provinceList}
          fieldNames={{
            label: "NAME",
            value: "CODE",
          }}
          onChange={changeProvinceHandler}
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.NAME ?? "")?.includes(input)
          }
        />
      </Form.Item>
      <Form.Item
        name={schema.cityKey}
        initialValue={schema.initialCityValue}
        style={{ marginBottom: "10px" }}
      >
        <Select
          style={selectStyle}
          placeholder="请选择城市"
          disabled={!showCityList?.length}
          options={showCityList}
          fieldNames={{
            label: "NAME",
            value: "CODE",
          }}
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.NAME ?? "")?.includes(input)
          }
        />
      </Form.Item>
    </>
  )
}