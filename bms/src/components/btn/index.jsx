import PropTypes from "prop-types"
import { Button } from "antd"
import { useState, useRef } from "react"

const Btn = props => {
  const loadingRef = useRef(false)
  const lastClickTime = useRef(null)
  const [loading, setLoading] = useState(false)

  // 点击确认按钮时触发
  const clickHandler = () => {
    if (loadingRef.current) {
      return
    }

    if (props.throttleTime != undefined) {
      // 表示开启了节流功能
      if (lastClickTime.current) {
        // 如果current为null的话，那么表示是第一次点击，那么此时自然无需节流拦截的
        const current = performance.now()
        const gap = current - lastClickTime.current
        if (gap < props.throttleTime) {
          return
        }
      }
    }

    setLoading(true)
    loadingRef.current = true
    props.onClick().then(() => {
      lastClickTime.current = performance.now()
    }).finally(() => {
      loadingRef.current = false
      setLoading(false)
    })
  }

  return (
    <Button type={props.type} loading={loading} onClick={clickHandler}>{props.text}</Button>
  )
}

Btn.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func,
  throttleTime: PropTypes.number, // 节流时间，单位是ms
}

export default Btn