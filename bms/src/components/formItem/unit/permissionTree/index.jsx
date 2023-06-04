import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Checkbox, Card } from "antd"
import { RightOutlined } from "@ant-design/icons"
import styles from "./index.less"

const PermissionTree = props => {
  const {
    level,
  } = props
  const permissions = props.permissions || []
  const checkedPermissionIds = props.value || []

  const [activeIdx, setActiveIdx] = useState(0) // 当前批所选中的权限索引

  const childPermissions = permissions[activeIdx]?.children

  const returnRowClsName = (idx) => {
    if (idx === activeIdx) {
      return styles.activeRow
    }
    return styles.rowCls
  }

  const findEdgePermission = permission => {
    const answer = []
    const find = obj => {
      if (!obj?.children?.length) {
        answer.push(obj)
        return
      }
      for (const p of obj.children) {
        find(p)
      }
    }
    find(permission)
    return answer
  }

  const changeCheckStatus = (event, perm) => {
    const edges = findEdgePermission(perm)
    const target = {}
    edges.forEach(obj => {
      target[obj.id] = event.target.checked
    })
    const currentAllCheckd = {}
    checkedPermissionIds.forEach(id => currentAllCheckd[id] = true)
    for (let newid in target) {
      if (event.target.checked) {
        currentAllCheckd[newid] = true
      } else {
        if (newid in currentAllCheckd) {
          delete currentAllCheckd[newid]
        }
      }
    }
    let answer = Object.keys(currentAllCheckd)
    answer = answer.map(str => Number(str))
    props.onChange(answer)
  }

  // 返回选中状态
  const returnCheckStatus = permissionObject => {
    const edges = findEdgePermission(permissionObject)
    const checkIsAllEdgeChecked = edges.every(obj => {
      return checkedPermissionIds.includes(obj.id)
    })
    const checkIsSomeEdgeChecked = edges.some(obj => {
      return checkedPermissionIds.includes(obj.id)
    })
    if (checkIsAllEdgeChecked) {
      return {
        checked: true,
        indeterminate: false,
      }
    } else if (checkIsSomeEdgeChecked) {
      return {
        checked: false,
        indeterminate: true,
      }
    } else {
      return {
        checked: false,
        indeterminate: false,
      }
    }
  }

  useEffect(() => {
    setActiveIdx(0)
  }, [permissions])

  if (!permissions.length) {
    return null
  }
  return (
    <div className={styles.cardContainer}>
      <Card title={`${countMap[level]}级类目`}>
        {
          permissions.map((permissionObj, idx) => {
            const checkStatusObj = returnCheckStatus(permissionObj)
            return (
              <div
                key={permissionObj.id}
                className={returnRowClsName(idx)}
                onClick={() => setActiveIdx(idx)}
              >
                <Checkbox
                  checked={checkStatusObj.checked}
                  indeterminate={checkStatusObj.indeterminate}
                  onChange={event => changeCheckStatus(event, permissionObj)}
                />
                <div
                  className={styles.row2Cls}
                >
                  <span>{permissionObj.name}</span>
                  {permissionObj.children?.length > 0 ? (
                    <RightOutlined />
                  ) : null}
                </div>
              </div>
            )
          })
        }
      </Card>

      <PermissionTree
        {...props}
        level={level + 1}
        permissions={childPermissions}
      />
    </div>
  )
}

const countMap = {
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
  7: "七",
  8: "八",
  9: "九",
}

PermissionTree.propTypes = {
  level: PropTypes.number, // 层级数
  permissions: PropTypes.array, // 权限列表
  value: PropTypes.array, // 选中的权限列表
  onChange: PropTypes.func, // 更新选中的权限列表
}

export default PermissionTree