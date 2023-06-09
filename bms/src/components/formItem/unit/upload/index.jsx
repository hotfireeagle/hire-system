import { Upload, message,Image } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { useState } from "react"
import PropTypes from "prop-types"
import request from "@/utils/request"

// 由于支持多张图片，所以显示值是一个数组，所以如果接收到的值不是数组的话，这里做一个转化
const toArray = (value) => {
  if (Object.prototype.toString.call(value) === "[object Array]") {
    return value
  }
  if (!value) {
    return []
  }
  return [value]
}

// 转成Upload所能接受的参数
const toFileList = (arr) => {
  return arr.map((url) => ({
    url,
  }))
}

const LocalUpload = ({
  onChange,
  value,
  max,
  disabled,
  accept,
  needEmit,
  maxSize = 5,
}) => {
  const imageUrls = toArray(value)
  const [previewImage, setPreviewImage] = useState("")
  const [visible, setVisible] = useState(false)

  const onChangeWrapper = (newImgArr) => {
    let emitValue
    if (max <= 1) {
      // 单选模式，传给父组件一个字符串
      emitValue = newImgArr[0]
    } else {
      // 多选，传给父组件一个数组
      emitValue = newImgArr
    }
    onChange(emitValue)
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">选择文件</div>
    </div>
  )

  const beforeUpload = async (file) => {
    if (file.size > 1024 * 1024 * maxSize) {
      message.error(`文件大小不能超过${maxSize}M`)
      return false
    }

    const formData = new FormData()
    formData.append("file", file)

    const closeCb = message.loading("上传中")
    request("/common/upload", formData, "formdata").then(res => {
      const result = res
      const newImgList = [...imageUrls]
      newImgList.push(result)
      onChangeWrapper(newImgList)
      // 这里是为了拿到图片后等下个接口回调之后在结束进程
      if (!!needEmit) {
        needEmit(formData).then(() => {
          closeCb()
        })
      } else {
        closeCb()
      }
    })
    return false // 不调用默认的上传方法
  }

  // 删除图片的时候触发
  const delImgRender = (uploadFileObj) => {
    const newImgUrls = imageUrls.filter((url) => {
      return url !== uploadFileObj.url
    })
    onChangeWrapper(newImgUrls)
  }

  // 判断是否需要禁止选择
  const checkNeedDisabled = () => {
    return imageUrls.length >= max
  }

  return (
    <>
      <Upload
        accept={accept}
        disabled={disabled}
        listType="picture-card"
        fileList={toFileList(imageUrls)}
        beforeUpload={beforeUpload}
        onRemove={delImgRender}
        maxCount={max}
        onPreview={(file) => {
          setPreviewImage(file.url)
          setVisible(true)
        }}
      >
        {checkNeedDisabled() ? null : uploadButton}
      </Upload>
      <Image
        width={200}
        style={{ display: "none" }}
        src={previewImage}
        preview={{
          visible,
          scaleStep: 0.1, // 滚轮缩放的步长
          src: previewImage,
          onVisibleChange: (value) => {
            setVisible(value)
          },
        }}
      />
    </>
  )
}

LocalUpload.propTypes = {
  onChange: PropTypes.func, // 文件变化
  value: PropTypes.any, // 初始值
  max: PropTypes.any, // 上传照片的最大值
  disabled: PropTypes.any, // 是否禁用
  maxSize: PropTypes.number, // 上传图片的最大mb
  uploadDir: PropTypes.string, // 上传目录
  accept: PropTypes.string, // 上传文件的类型
  needEmit: PropTypes.func, // 是否需要回调
}

export default LocalUpload
