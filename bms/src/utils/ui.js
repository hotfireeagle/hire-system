import { Image, Tooltip } from "antd"

export function renderImgInTable(v) {
  return <Image width={60} src={v} />
}

// 渲染几行文本，超出省略号，然后通过toolTip进行查看
export function renderSomeLineWithTooltip(content) {
  const styleObj = {
    width: "100%",
    wordBreak: "break-all",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  }
  return (
    <Tooltip title={content}>
      <span style={styleObj}>{content}</span>
    </Tooltip>
  )
}