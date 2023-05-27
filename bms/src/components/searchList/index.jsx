import { useState, useLayoutEffect, useEffect } from "react"
import { Form } from "antd"
import { Button, Table, Pagination, Popover, Checkbox, message } from "antd"
import {
  onTableData,
  handleTimes,
  computeTableSummaryByColumnsAndSource,
  handleTimesOther,
} from "./utils/utils.js"
import {
  InputSchemaUI,
  SelectSchemaUI,
  RangePickerSchemaUI,
  DatePickerSchemaUI,
  NumberInputSchemaUI,
  ProvinceAndCity,
  TreeSelectSchemaUI,
} from "./searchSchemas/index.js"
import request from "@/utils/request"
import PropTypes from "prop-types"
import { SettingOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons"
import styles from "./index.less"
import { writeToDbComplete, readFromDB } from "./cache.js"
// 注：组件存在两个外部控制数据，分别是outSearchPostData和searchDefaultData，存在一点小区别，有一个被Effect监听了，有一个没有；
// 注2：有关缓存功能，已知是不能和resetPage功能搭配使用的；如果某些场景就是需要resetPage和缓存功能搭配进行使用的话
// 那么推荐上层组件不共用多个SearchList，而是每个状态使用各自的SearchList

const vMap = {
  ascend: "asc",
  descend: "desc",
}

const SearchList = props => {
  const returnCacheKey = () => `${props.url}_${location.pathname}_${props.cacheId}` // 返回缓存key值，不一定存在

  const dbCacheData = readFromDB(returnCacheKey()) // 获取到缓存数据，不一定存在

  // 判断是否开启缓存功能
  const checkIsEnableCache = () => !!props.cacheId

  /**
   * 把cacheObj中有关排序的字段解构出来，重新映射回state，这里需要留意存在两种转换模式
   */
  const unstructSortObj = () => {
    let defaultSortObj = props.defaultSortObj || {} // 兜底的排序状态对象，默认先取外部配置的默认数据

    if (!props.sortKeyMap) {
      // 表示不存在排序字段
      return defaultSortObj
    }

    if (!checkIsEnableCache()) {
      // 表示没有开启缓存功能
      return defaultSortObj
    }

    const cacheObj = readFromDB(returnCacheKey())

    if (!cacheObj) {
      // 不存在缓存数据
      return defaultSortObj
    }

    // 需要排序功能，且开启了缓存，且存在缓存数据（注：存在缓存数据，但是不一定缓存了排序相关的数据）

    const findKeyByValue = (obj, value) => {
      for (let k in obj) {
        if (obj[k] == value) {
          return k
        }
      }
    }

    if (props.sortMode2) {
      // 使用一个字段的形式
      let theField
      for (let k in props.sortKeyMap) {
        const v = props.sortKeyMap[k]
        if (v in cacheObj) {
          // 这种方式的只能这样找了，理论上是不会存在排序字段名称和搜索条件名称的值是一样的情况
          theField = k
          break
        }
      }
      if (theField) {
        defaultSortObj = {
          field: theField,
          order: cacheObj[theField],
        }
      }
    } else {
      // 拆成两个字段的形式，两个字段叫做sortField、sortType
      // 根据value找key即可
      if ("sortField" in cacheObj && "sortType" in cacheObj) {
        defaultSortObj = {
          field: findKeyByValue(props.sortKeyMap, cacheObj.sortField),
          order: findKeyByValue(vMap, cacheObj["sortType"]),
        }
      }
    }

    return defaultSortObj
  }

  const [form] = Form.useForm()
  const [page, setPage] = useState(dbCacheData?.pageNumber || 1)
  const [pageSize, setPageSize] = useState(dbCacheData?.pageSize || 10)
  const [loading, setLoading] = useState(false)
  const [sortObj, setSortObj] = useState(unstructSortObj()) // 排序对象，其中field为排序字段，order为排序方式
  const [apiRes, setApiRes] = useState({}) // 列表接口返回数据
  const [forceUpdate, setForceUpdate] = useState(false) // 组件自身交互需引起强制刷新，比如说点击搜索按钮/重置按钮
  const [allColumns, setAllColumns] = useState([]) // table组件所需要显示的所有列
  const [visible, setVisible] = useState(false) // 导出弹窗是否显示
  const [dragList, setDragList] = useState([]) // 拖拽列表

  // 如果存在必要的话，那么把数据存储到缓存中；否则的话就没必要
  const write2DbBus = data => {
    if (!checkIsEnableCache()) {
      // 没有开启缓存功能
      return
    }
    // 开启了缓存功能
    writeToDbComplete(returnCacheKey(), data)
  }

  useEffect(() => {
    const tct = props.tableColumns.map(obj => obj.title)
    setAllColumns(tct)
  }, [props.tableColumns])
  useEffect(() => {
    // 之前的版本才组件挂载之后，会把页码重置为第一页；加入数据缓存功能之后
    // 由于会存在冲突（它会覆盖缓存数据中存储的那个页码，但是其实是不应该覆盖的），所以这里加了一个状态去进行判断处理，只有存在需要被外部覆盖的场景再去重置为1
    // 因此：如果一个SearchList在同一个页面调用同一个接口，需要展示多块数据的话，那么这里是不能搭配缓存化功能进行使用的
    if (props.needResetPageWhenMount) {
      setPage(1)
    }
  }, [props?.resetPage])

  let lv
  try {
    if (props.name && props.showColumnSetting) {
      lv = localStorage.getItem(`${props.name}_tableColumnsConfig`)
      lv = JSON.parse(lv)
    }
  } catch (err) {}

  const [selectColumnMap, setSelectColumnMap] = useState(lv)

  // 返回请求列表接口所需返回的数据
  const returnPostData = () => {
    const searchObj = form.getFieldsValue(true) || {}
    if (props?.timeFormatStr) {
      for (const key of props.timesOtherKeys) {
        handleTimesOther(searchObj, key, props.timeFormatStr)
      }
    } else {
      handleTimes(
        searchObj,
        props.timesKey,
        props.startTimeKey,
        props.endTimeKey,
        props.startTimeFormatStr,
        props.endTimeFormatStr,
      )

      if (props?.extraConvertTimes?.length) {
        // 对列表需要支持的其它时间字段进行处理
        for (const convertTimeObj of props.extraConvertTimes) {
          handleTimes(
            searchObj,
            convertTimeObj.key,
            convertTimeObj.startTimeKey,
            convertTimeObj.endTimeKey,
            convertTimeObj.startTimeFormatStr || "YYYY-MM-DD 00:00:00",
            convertTimeObj.endTimeFormatStr || "YYYY-MM-DD 23:59:59",
          )
        }
      }
    }
    for (let key in searchObj) {
      if (!searchObj[key] || JSON.stringify(searchObj[key]) == "[]") {
        delete searchObj[key]
      }
    }
    const finalPostData = {
      ...props?.searchDefaultData, //搜索默认数据
      ...searchObj,
      pageNumber: page,
      pageSize,
      ...returnSortObj(),
    }

    // 如果有必要的话，把数据缓存下来
    write2DbBus(finalPostData)

    return finalPostData
  }

  // 返回排序对象
  const returnSortObj = () => {
    if (!checkIsSortValueable()) {
      // 没有有效排序值
      return {}
    } else {
      if (props.sortMode2) {
        // 排序模式2
        const v = sortObj.order // 排序方式1
        const sortKeyName = sortObj.field // 排序字段
        return {
          [props?.sortKeyMap[sortKeyName]]: vMap[v],
        }
      } else {
        // 排序模式2，拆分成sortField字段和sortType字段
        const obj = {
          sortField: props?.sortKeyMap[sortObj.field],
          sortType: vMap[sortObj.order],
        }
        return obj
      }
    }
  }

  /**
   * 默认的请求方法
   * @param {*} postData : 数据请求方法
   * @returns
   */
  const initFetchHandler = postData => {
    let pd = postData || {}
    if (props.outSearchPostData) {
      pd = {
        ...pd,
        ...props.outSearchPostData,
      }
    }
    return request(props.url, pd, props.method || "post")
  }

  // 请求表格数据的最外层方法
  const fetchFun = () => {
    // 确定是适用组件自带的fetch 还是 父组件自定义的
    const fetchCb = props.fetchHandler ? props.fetchHandler : initFetchHandler

    if (!fetchCb) {
      const err = "请传入initFetchHandler=true，或者自定义fetchHandler"
      console.error(err)
      return Promise.reject(err)
    }

    setLoading(true)

    const postData = returnPostData()

    let responseResult = {}
    return fetchCb(postData)
      .then(res => {
        responseResult = res || {}
      })
      .finally(() => {
        // 重置tableRowSelection
        if (props?.tableRowSelection?.reset) {
          props?.tableRowSelection?.reset()
        }

        if (props.syncResCb) {
          // 向上方回传列表接口所返回的数据
          props.syncResCb(responseResult)
        }

        // 需要处理合并数据函数
        if (props.mergeDataHandler) {
          setApiRes(props.mergeDataHandler(responseResult))
        } else {
          setApiRes(responseResult)
        }
        setLoading(false)
      })
  }

  // 使用useLayoutEffect监听数据是否变化
  useLayoutEffect(() => {
    if (checkIsEnableCache()) {
      // 表示开启了缓存
      const cacheData = readFromDB(returnCacheKey())
      // 如果存在缓存数据的话，把缓存数据给取出来用
      if (cacheData) {
        form.setFieldsValue(cacheData)
      }
    }
  }, [])

  // 加载表格数据方法
  // 加载时机：组件mount、分页器参数变化，点击搜索按钮、重置按钮等
  useEffect(() => {
    fetchFun()
  }, [
    props.needReload,
    page,
    pageSize,
    forceUpdate,
    sortObj,
    props.outSearchPostData,
    dragList, // 拖拽列表
  ])

  // 点击搜索时触发
  const clickSubmitHandler = () => {
    if (page == 1) {
      setForceUpdate(!forceUpdate)
    } else {
      setPage(1) // 重置分页器
    }
  }

  /**
   * 进行重置的处理方法
   */
  const resetHandler = () => {
    form.resetFields() // 重置表单
    if (page == 1) {
      setForceUpdate(!forceUpdate)
    } else {
      setPage(1) // 重置分页器
    }
  }

  const returnTotal = () => {
    const obj = apiRes
    if (Object.prototype.toString.call(obj) === "[object Array]") {
      return obj.length
    } else {
      return obj?.total || 0
    }
  }

  // 分页器配置
  const paginationProps = {
    current: page,
    pageSize,
    total: returnTotal(),
    showSizeChanger: true, // 默认即展示每页条数修改的选择器
    showQuickJumper: true, // 默认即展示快速跳转到某页的选择器
    //选择器增加999
    pageSizeOptions: ["10", "20", "50", "100"],
    showTotal: total => (
      <span style={{ fontSize: "14px" }}>
        <span>共{total}条</span>
      </span>
    ),
  }

  /**
   * 修改table的筛选条件时触发
   */
  const changeSorterHandler = (_, filterOption, sortObj) => {
    setSortObj(sortObj)
  }

  /**
   * 分页器改变页码的时候触发
   * @param {*} page
   * @param {*} pageSize
   */
  const changePaginationHandler = (page, pageSize) => {
    setPage(page)
    setPageSize(pageSize)
  }

  // 判断排序值是否有效，不仅得有key，还得有指定的order
  const checkIsSortValueable = () => {
    return sortObj?.field && sortObj?.order
  }

  // 对表格数据进行配置
  const tableColumnsFactory = () => {
    let columnList = props.tableColumns || []
    //过滤掉hide为true的列
    columnList = columnList.filter(item => !item.hide)
    if (!checkIsSortValueable()) {
      // 表明没有排序字段

      // 重置所有已经存在过的排序字段
      columnList.forEach(obj => {
        obj.sortOrder = false
      })

      if (selectColumnMap == null) {
        return columnList
      } else {
        return columnList.filter(obj => {
          const { title } = obj
          return selectColumnMap[title]
        })
      }
    }

    columnList.forEach(obj => {
      obj.sortOrder = false
    })

    columnList = columnList.map(columnObj => {
      if (columnObj.dataIndex == sortObj.field) {
        // 返回处于焦点的排序顺序，不受控也行，但是既然数据加载取决于state，为了避免出现加载的升序数据，但是显示的却是无序图标的问题出现，所以这里显示也受控一下（为了的数据拉取和UI显示一定一致）
        columnObj.sortOrder = sortObj.order
      }
      return columnObj
    })

    if (selectColumnMap == null) {
      return columnList
    } else {
      return columnList.filter(obj => {
        const { title } = obj
        return selectColumnMap[title]
      })
    }
  }

  /**
   * 渲染搜索表单
   */
  const renderSearchHandler = () => {
    const schemas = props.searchSchema || []
    return schemas.map((schemaObj, idx) => {
      if (schemaObj.hide) {
        return
      }
      switch (schemaObj.type) {
        case "input":
          return <InputSchemaUI schema={schemaObj} key={idx} />
        case "select":
          return <SelectSchemaUI schema={schemaObj} key={idx} />
        case "rangePicker":
          return <RangePickerSchemaUI schema={schemaObj} key={idx} />
        case "datePicker":
          return <DatePickerSchemaUI schema={schemaObj} key={idx} />
        case "numberInput":
          return <NumberInputSchemaUI schema={schemaObj} key={idx} />
        case "customize":
          return schemaObj.render() // 父组件自身去定义
        case "provinceAndCity":
          return <ProvinceAndCity schema={schemaObj} key={idx} formInstance={form} />
        case "treeSelect":
          return <TreeSelectSchemaUI schema={schemaObj} key={idx} />
        default:
          return null
      }
    })
  }

  // 渲染table组件的选择全部的区域
  const renderPopoverTitle = () => {
    const c1 = v => {
      if (v.target.checked) {
        const m = {}
        allColumns.forEach(k => {
          m[k] = true
        })
        setSelectColumnMap(m)
        localStorage.setItem(`${props.name}_tableColumnsConfig`, JSON.stringify(m))
      } else {
        setSelectColumnMap({})
        localStorage.setItem(`${props.name}_tableColumnsConfig`, JSON.stringify({}))
      }
    }

    const sc = tableColumnsFactory()
    const v1 = sc.length === allColumns.length

    return (
      <Checkbox checked={v1} onChange={c1}>
        全部列
      </Checkbox>
    )
  }

  // 渲染列表组件设置哪些列进行显示的组件
  const renderPopoverContent = () => {
    const columnList = tableColumnsFactory()

    const c2 = vals => {
      const obj = {}
      vals.forEach(v => {
        obj[v] = true
      })
      setSelectColumnMap(obj)
      localStorage.setItem(`${props.name}_tableColumnsConfig`, JSON.stringify(obj))
    }

    const v2 = columnList.map(item => item.title)

    return <Checkbox.Group onChange={c2} value={v2} options={allColumns} />
  }

  const returnDataSource1 = () => {
    const res = apiRes
    let dataArr
    if (Object.prototype.toString.call(res) === "[object Array]") {
      dataArr = res
    } else {
      dataArr = res?.records || []
    }
    return dataArr
  }

  const dataFactory = () => {
    let dataArr = returnDataSource1()
    if (props.showSummary) {
      // 表明需要显示总结栏
      const tableColumns = tableColumnsFactory()
      dataArr = computeTableSummaryByColumnsAndSource(
        tableColumns,
        dataArr,
        props.unshowComputedColumns,
      )
    } else {
      dataArr = returnDataSource1()
    }
    return onTableData(dataArr, props.rowKey)
  }

  const paginationWrapperStyle = {
    display: "flex",
    marginTop: 20,
  }

  const checkNoPagination = () => {
    return (
      props.pagination === false || Object.prototype.toString.call(apiRes) === "[object Array]"
    )
  }

  /**
   * 移动的时候触发
   * @param {*} oldIndex
   * @param {*} newIndex
   */
  const onDragHandler = (oldIndex, newIndex) => {
    const { url, key, requestKey } = props?.tableDrag // 接口地址 key 接口参数的key requestKey 接口参数的key
    const list = [...dataFactory()]
    //根据拖拽的位置，重新排序 从0开始
    list.splice(newIndex, 0, list.splice(oldIndex, 1)[0])
    const keyArr = list.map(item => item[key])
    request(url, { [requestKey]: keyArr }, "post").then(res => {
      message.success("修改成功")
      setDragList(list)
    })
  }

  // 导出时触发，目前只支持导出到导出中心的处理
  const exportHandler = () => {
    const currentPostData = returnPostData()
    return request(props.exportUrl, currentPostData, "post").then(res => {
      message.success("导出成功")
    })
  }

  return (
    <div className={styles.formhooks}>
      {props.searchSchema?.length ? (
        <Form
          form={form}
          layout="inline"
          onFinish={clickSubmitHandler}
          style={{ marginBottom: 20 }}
        >
          {renderSearchHandler()}
          <>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={resetHandler}>重置</Button>
            </Form.Item>
            {// 如果有exportUrl，就渲染出来
            props.exportUrl && (
              <Form.Item>
                <Button
                  type="primary"
                  icon={<VerticalAlignBottomOutlined />}
                  onClick={() => {
                    props.handleExport ? props.handleExport(props.exportUrl) : exportHandler()
                  }}
                  // onClick={() => setVisible(!visible)}
                >
                  导出
                </Button>
              </Form.Item>
            )}
          </>
        </Form>
      ) : null}
      {/** 自定义区域，比如说 新增按钮 */}
      {props.showColumnSetting || props.children ? (
        <div className={styles.center}>
          {props.children}
          <span className={styles.flexg} />
          {props.showColumnSetting ? (
            <Popover
              content={renderPopoverContent}
              title={renderPopoverTitle}
              trigger="click"
              placement="leftTop"
            >
              <SettingOutlined style={{ fontSize: 16 }} />
            </Popover>
          ) : null}
        </div>
      ) : null}
      {/* <ReactDragListView
        onDragEnd={onDragHandler}
        handleSelector={
          props?.tableDrag?.handleSelector || "span[aria-label="menu"]"
        }
      > */}
      <Table
        scroll={props.scroll}
        columns={tableColumnsFactory()}
        bordered={props.bordered}
        dataSource={dataFactory()}
        pagination={false}
        onChange={changeSorterHandler}
        loading={loading}
        rowSelection={props?.tableRowSelection}
        size={props.size}
      />
      {/* </ReactDragListView> */}
      {checkNoPagination() ? null : (
        <div style={paginationWrapperStyle}>
          <div style={{ flexGrow: 1 }} />
          <Pagination
            {...paginationProps}
            onChange={changePaginationHandler}
            onShowSizeChange={changePaginationHandler}
          />
        </div>
      )}
    </div>
  )
}

SearchList.propTypes = {
  outSearchPostData: PropTypes.object, // 外界控制的列表请求传参
  url: PropTypes.string, // 请求URL
  method: PropTypes.string, // http method，【非必填，默认post】
  searchSchema: PropTypes.array, // 搜索数据建模
  tableColumns: PropTypes.array, // table的column描述
  needReload: PropTypes.bool, // 是否需要重新请求数据
  fetchHandler: PropTypes.func, // 数据请求方法，非必填，返回一个promise对象即可，resolve接口返回的数据
  bordered: PropTypes.bool, // 是否展示表格边框
  sortKeyMap: PropTypes.object, // 排序字段映射，比如说amount字段需要进行排序，表示amount排序的字段叫isAmountDesc，那么这个配置对象就叫做{amount: "isAmountDesc"}
  sortMode2: PropTypes.bool, // 排序的第二种模式传参，一个字段处理排序功能，字段名表示排序字段，字段值表示排序值
  showSummary: PropTypes.bool, // 是否展示总结栏
  showColumnSetting: PropTypes.bool, // 是否展示列设置
  name: PropTypes.string, // 模块名称，必须唯一，在控制列是否展示时，这个属性必传
  defaultSortObj: PropTypes.object, // 默认的排序对象，传参类似：{ field: "totalPrice", order: "ascend" }，需要注意的是这个totalPrice不是接口定义的排序字段名称，而是columns中的该字段的名称；order只有两个值可选：ascend、descend
  timesKey: PropTypes.string, // 表示时间的key
  startTimeKey: PropTypes.string, // 开始时间的key
  endTimeKey: PropTypes.string, // 结束时间的key
  startTimeFormatStr: PropTypes.string, // 开始时间格式化字符串
  endTimeFormatStr: PropTypes.string, // 结束时间格式化字符串
  searchDefaultData: PropTypes.object, // 搜索默认数据
  tableDrag: PropTypes.object, // 是否开启表格拖拽
  unshowComputedColumns: PropTypes.array, //不该展示的总计
  rowKey: PropTypes.string, // 唯一索引key值
  extraConvertTimes: PropTypes.array, // 如果列表需要支持多个时间进行搜索的话，那么其它时间可以放在这里；注意通过times或者timesKey就不要放在这里面了
  mergeDataHandler: PropTypes.func, // 合并数据的方法
  cacheId: PropTypes.string, // 非必传；如果传了的话，这个ID必须唯一，既表示开启SearchList的搜索数据缓存功能，也表示搜索数据缓存的key值
  syncResCb: PropTypes.func, // 同步返回数据的方法
  timeFormatStr: PropTypes.string, //非必传 时间格式 存在时 时间参数为数组传输
  timesOtherKeys: PropTypes.array, //非必传 timeFormatStr存在时有效 需要处理的时间key数组
  handleExport: PropTypes.func,
}

export default SearchList
