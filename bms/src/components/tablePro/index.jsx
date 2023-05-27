import { ProTable } from "@ant-design/pro-components"
import PropTypes from "prop-types"
import request from "@/utils/request"

const TablePro = props => {
  const requestFunction = async (params, sort, filter) => {
    const postData = {
      ...(params),
    }
    
    const data = await request(props.url, postData, "post")

    return {
      data: data?.list || [],
      success: true,
      tota: data.total,
    }
  }

  return (
    <ProTable
      request={requestFunction}
      columns={props.columns}
    >

    </ProTable>
  )
}

TableProp.propTypes = {
  url: PropTypes.string, // table的列表数据接口
  columns: PropTypes.array, // table的columns配置数据
}

export default TablePro