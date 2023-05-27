import moment from "moment"

// LOG: 使用索引来作为key的场景，在批量操作的场景会存在问题，外部应该自己另指定SearchList的key
export function onTableData(e, rowKey) {
  if (!!e) {
    const customData =
      e === []
        ? []
        : e.map((item, sign) => {
            const newsItem = { ...item }
            const keys = sign + 1
            if (rowKey) {
              newsItem.key = item[rowKey]
            } else {
              newsItem.key = keys
            }
            return newsItem
          })
    return customData
  } else {
    return []
  }
}

export const handleTimes = (
  obj,
  timesKey = "times",
  startTimeKey,
  endTimeKey,
  startTimeFormat = "YYYYMMDD",
  endTimeFormat = "YYYYMMDD",
) => {
  if (!obj) {
    return
  }

  const timeArray = obj[timesKey]

  if (!timeArray || !timeArray.length) {
    delete obj[startTimeKey]
    delete obj[endTimeKey]
    return
  }

  let [beginTime, endTime] = timeArray

  beginTime = moment(beginTime).format(startTimeFormat)
  endTime = moment(endTime).format(endTimeFormat)

  if (!startTimeKey || !endTimeKey) {
    console.warn(
      "如果searchList中搜索表单存在时间范围搜索数据的话，那么必须传人startTimeKey和endTimeKey",
    )
    return
  }

  obj[startTimeKey] = beginTime
  obj[endTimeKey] = endTime
}
export const handleTimesOther = (obj, timesKeyObj, timeFormat = "YYYY-MM-DD") => {
  if (!obj) {
    return
  }
  const timeArray = obj[timesKeyObj["key"]]

  if (!timeArray || !timeArray.length) {
    delete obj[timesKeyObj["value"]]
  } else {
    let [beginTime, endTime] = timeArray
    beginTime = moment(beginTime).format(timeFormat) + " 00:00:00"
    endTime = moment(endTime).format(timeFormat) + " 00:00:00"
    obj[timesKeyObj["value"]] = [beginTime, endTime]
  }
}
/*
 * 图片压缩
 * @param {object} file :图片文件信息
 * @param {string} width :宽
 * @param {string} height :高
 */
export const compression = (file, width, height) => {
  if (file && file.size < 1024 * 100 * 5) {
    // 小于500kb的暂不压缩
    return Promise.resolve({
      file,
    })
  }

  return new Promise(resolve => {
    const reader = new FileReader() // 创建 FileReader
    reader.onload = ({ target: { result: src } }) => {
      const image = new Image() // 创建 img 元素
      image.onload = async () => {
        const canvas = document.createElement("canvas") // 创建 canvas 元素
        canvas.width = width || image.width
        canvas.height = height || image.height
        let context = canvas.getContext("2d")
        // 在canvas绘制前填充白色背景
        // context.fillStyle = "#fff"
        // context.fillRect(0, 0, width || image.width, height || image.height)
        context.drawImage(image, 0, 0, width || image.width, height || image.height) // 绘制 canvas
        const canvasURL = canvas.toDataURL("image/jpeg", 0.8)
        const buffer = atob(canvasURL.split(",")[1])
        let length = buffer.length
        const bufferArray = new Uint8Array(new ArrayBuffer(length))
        while (length--) {
          bufferArray[length] = buffer.charCodeAt(length)
        }
        const miniFile = new File([bufferArray], file.name, {
          type: "image/jpeg",
        })
        miniFile.uid = 0
        resolve({
          file: miniFile,
          origin: file,
          beforeSrc: src,
          afterSrc: canvasURL,
          beforeKB: Number((file.size / 1024).toFixed(2)),
          afterKB: Number((miniFile.size / 1024).toFixed(2)),
        })
      }
      image.src = src
    }
    reader.readAsDataURL(file)
  })
}

/**
 * 富文本文件上传前的函数
 * @param {*} param
 */
export const bfUploadFn = async param => {
  const serverURL = "/hht/common/upload"
  const xhr = new XMLHttpRequest()
  const fd = new FormData()

  const successFn = () => {
    // 假设服务端直接返回文件上传后的地址
    // 上传成功后调用param.success并传入上传后的文件地址
    const res = JSON.parse(xhr.responseText) || {}
    const url = res?.body?.url
    param.success({
      url,
    })
  }

  const progressFn = event => {
    // 上传进度发生变化时调用param.progress
    param.progress((event.loaded / event.total) * 100)
  }

  const errorFn = () => {
    // 上传发生错误时调用param.error
    param.error({
      msg: "unable to upload.",
    })
  }

  xhr.upload.addEventListener("progress", progressFn, false)
  xhr.addEventListener("load", successFn, false)
  xhr.addEventListener("error", errorFn, false)
  xhr.addEventListener("abort", errorFn, false)

  const resultFile = await compression(param.file)

  fd.append("file", resultFile.file)
  fd.append("type", "01")
  xhr.open("POST", serverURL, true)
  // xhr.setRequestHeader("token", getToken())
  xhr.send(fd)
}

/**
 * 计算总结栏的合计
 * @param {Array} columns : table组件的columns配置数据
 * @param {Array} arr : table组件的dataSource数据
 * @returns Array : 新的dataSource数据
 */
export const computeTableSummaryByColumnsAndSource = (columns, arr, unshowComputedColumns = []) => {
  if (Object.prototype.toString.call(columns) !== "[object Array]") {
    console.error("columns must be array")
    return []
  }

  if (Object.prototype.toString.call(arr) !== "[object Array]") {
    console.error("arr must be array")
    return []
  }

  const item = {}

  columns.forEach(obj => {
    const { dataIndex } = obj
    if (typeof dataIndex === "object") {
      // 如果是多个字段的合计
      dataIndex.forEach(key => {
        item[key] = 0
      })
    }
    item[dataIndex] = 0
  })

  const ka = Object.keys(item)

  const summaryObj = arr.reduce((prevObj, currentObj) => {
    for (let i = 0; i < ka.length; i++) {
      const key = ka[i]
      const val = currentObj[key]

      if (!/^\d+(\.\d+)?$/.test(val)) {
        // 过滤掉非数字
        prevObj[key] = "-"
        continue
      }
      prevObj[key] += Number(val)
    }

    return prevObj
  }, item)

  const firstKey = columns && columns[0] && columns[0].dataIndex

  if (firstKey) {
    summaryObj[firstKey] = "总计"
  }
  if (unshowComputedColumns.length) {
    for (let i = 0; i < unshowComputedColumns.length; i++) {
      summaryObj[unshowComputedColumns[i]] = "--"
    }
  }

  const arr2 = [...arr, summaryObj]

  return arr2
}
