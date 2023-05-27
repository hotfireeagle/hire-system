import { Card, Checkbox } from "antd"
import PropTypes from "prop-types"
import { RightOutlined } from "@ant-design/icons"
import styles from "./index.less"
import { useState, useEffect } from "react"

let allTotalPermissions = [] // 所有权限列表数据

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
/** 递归渲染权限树
 * @param {Array} value 当前选中的权限ID列表
 * @param {Array} allPermissionList 所有权限列表
 * @param {Function} onChange 选中权限变化时的回调函数
 * @param {Number} level 当前权限树的层级
 * @returns
 */
const permissionDfsRender = (
  checkedIds,
  permissionList,
  onChange,
  count = 1
) => {
  if (!permissionList || !permissionList.length) {
    return null
  }

  return (
    <PermissionTree
      value={checkedIds}
      permissions={permissionList}
      onChange={onChange}
      count={count}
    />
  )
}

const PermissionTree = (props) => {
  const [activePermissionObj, setActivePermissionObj] = useState({}) // 默认展示的一级权限对象
  const [activePermissionIdx, setActivePermissionIdx] = useState(-1) // 默认展示的一级权限索引

  useEffect(() => {
    if (props.permissions && props.permissions.length) {
      setActivePermissionObj(props.permissions[0])
      setActivePermissionIdx(0)
    }
  }, [props.permissions])

  const setActiveHandler = (recordObj, idx) => {
    setActivePermissionObj(recordObj)
    setActivePermissionIdx(idx)
  }

  const returnRowClsName = (idx) => {
    if (idx === activePermissionIdx) {
      return styles.activeRow
    }
    return styles.rowCls
  }

  // 权限勾选值发生变化时
  // 每次勾选的时候，判断一下是否同级所有ID都选中了，如果是的话，那么上级也应该选中
  const checkboxChangeHandler = (event, permissionObject, clickIdx) => {
    const checkedVal = event.target.checked
    const currentAllCheckd = [...(props.value || [])]
    const { id, children } = permissionObject || {}
    const idx = currentAllCheckd.indexOf(id)

    if (!children || !children.length) {
      // 没有子了，简单处理即可
      if (checkedVal) {
        // before idx == -1
        // 未选中，点击进行选中
        idx == -1 && currentAllCheckd.push(id)
      } else {
        // 已选中，那么删除
        idx != -1 && currentAllCheckd.splice(idx, 1)
      }
    } else {
      // 有子，那么子和孙子都需要选中或者取消选中，进行递归
      // 第一步，找出自己的所有后代ID
      const allChildIds = findChildIds(children) // 只是孙子
      allChildIds.push(id) // 加上自己

      // 第二步，对每一个权限都做一个判断，未选中的话，那么去选中；已选中的话，那么去删除
      for (let id of allChildIds) {
        const idx = currentAllCheckd.indexOf(id)
        if (checkedVal) {
          // 选中父，那么及时子自己当前已处于选中状态，也不应该反选
          if (idx == -1) {
            // 未选中的话，去选中
            currentAllCheckd.push(id)
          } else {
            // 表明子自个已选中，那么继续保持不变
            // currentAllCheckd.splice(idx, 1)
          }
        } else {
          // 父被取消选中了，如果子选中了的话，那么取消它，否则不变
          if (idx != -1) {
            currentAllCheckd.splice(idx, 1)
          }
        }
      }
    }

    const finalVals = lastCheck(currentAllCheckd)

    props.onChange(finalVals)

    setActiveHandler(permissionObject, clickIdx)
  }

  /**
   * 还得做一个检查，如果子都选中了的话，那么父也得选中
   * 如果子都没选中的话，那么父也不要选中
   * @param {*} checkdIds : 已选中的ID
   */
  const lastCheck = (checkdIds) => {
    const selected = [...checkdIds]

    const dfsCheckHasChildUnCheck = (obj) => {
      const { children, id } = obj || {}
      if (!children || !children.length) {
        return selected.includes(id)
      }

      for (let c of children) {
        const f = dfsCheckHasChildUnCheck(c)
        if (!f) {
          // 表明c具有某个子或者某个孙子没选中
          const idx = selected.indexOf(id)
          if (idx != -1) {
            // 表明c当前是勾选上的
            // 那么应该取消勾选
            selected.splice(idx, 1)
          }
          // 直接剪枝，没必要在继续递归下去了
          return false
        }
      }

      // 表明c的子和孙子都是选中的，那么自己也应该勾选
      const idx = selected.indexOf(id)
      if (idx == -1) {
        selected.push(id)
      }

      return true
    }

    const dfsLastCheck = (arr) => {
      for (let p of arr) {
        const { children } = p
        dfsCheckHasChildUnCheck(p)
        if (children && children.length) {
          // 只要有child，那么就要检查下去
          dfsLastCheck(children)
        }
      }
    }

    dfsLastCheck(allTotalPermissions) // 所有权限都检查，而并非只检查当前这一级的

    return selected
  }

  // 找出所有的后代ID
  const findChildIds = (obj) => {
    const result = []

    const dfsFindChild = (o2) => {
      if (!o2) {
        return
      }
      const { children, id } = o2
      id && result.push(id)

      if (children && children.length) {
        for (let o3 of children) {
          dfsFindChild(o3)
        }
      }
    }

    for (let o1 of obj) {
      dfsFindChild(o1)
    }

    return result
  }

  // 检查权限是否勾选
  const checkPermissionIsChecked = (permissionObject) => {
    const allCheckedIds = props.value // 所有勾选的权限ID
    const { id } = permissionObject || {}

    if (!id) {
      return false
    }

    if (Object.prototype.toString.call(allCheckedIds) !== "[object Array]") {
      return false
    }

    return allCheckedIds.includes(id)
  }

  const returnIndeterminate = (pObj) => {
    if (!pObj || !pObj.children || !pObj.children.length) {
      return false
    }
    const { id, children } = pObj

    const checkedIdList = props.value // 所有勾选的权限ID
    if (Object.prototype.toString.call(checkedIdList) !== "[object Array]") {
      return false
    }

    // 自己是选中的
    if (checkedIdList.includes(id)) {
      return false
    }

    let flag = false

    // 只要存在一个子或者孙子被选中，那么就返回true
    const dfsCheckHasOneChildChecked = (arr) => {
      for (let p of arr) {
        const { children, id } = p
        if (checkedIdList.includes(id)) {
          flag = true
          return true
        }
        if (children && children.length) {
          let result = dfsCheckHasOneChildChecked(children)
          if (result) {
            return true
          }
        }
      }
      return false
    }

    dfsCheckHasOneChildChecked(children)

    if (flag) {
      return true
    } else {
      // 没有一个选中
      return false
    }
  }

  return (
    <div className={styles.cardContainer}>
      <Card title={`${countMap[props.count]}级类目`}>
        {props.permissions.map((permissionObj, idx) => {
          return (
            <div key={idx} className={returnRowClsName(idx)}>
              <Checkbox
                indeterminate={returnIndeterminate(permissionObj)}
                onChange={(event) =>
                  checkboxChangeHandler(event, permissionObj, idx)
                }
                checked={checkPermissionIsChecked(permissionObj)}
              />
              <div
                onClick={() => setActiveHandler(permissionObj, idx)}
                className={`${styles.rowCls} ${styles.row2Cls}`}
              >
                <span>{permissionObj.name}</span>
                {permissionObj.children && permissionObj.children.length > 0 ? (
                  <RightOutlined />
                ) : null}
              </div>
            </div>
          )
        })}
      </Card>

      {permissionDfsRender(
        props.value,
        activePermissionObj.children,
        props.onChange,
        props.count + 1
      )}
    </div>
  )
}

PermissionTree.propTypes = {
  value: PropTypes.array, // 勾选中的权限，里面即包含了一级ID，也包含了n级ID
  permissions: PropTypes.array, // 所有的权限列表数据
  onChange: PropTypes.func, // 修改权限的时候触发
}

/**
 * 返回接口传参数据，需要保证的是对于一级菜单来说，只要一级菜单的任意一个孙子选中了，那么一级菜单就应该被勾选
 * @param {*} ids : 勾选的ID
 * @param {*} allPermissions : 所有权限列表
 */
export const outForApi = (ids, allPermissions) => {
  let flag = false
  // 只要存在一个子或者孙子被选中，那么就返回true
  const dfsCheckHasOneChildChecked = (arr) => {
    for (let p of arr) {
      const { children, id } = p
      if (ids.includes(id)) {
        flag = true
        return true
      }
      if (children && children.length) {
        let result = dfsCheckHasOneChildChecked(children)
        if (result) {
          return true
        }
      }
    }
    return false
  }

  for (let p of allPermissions) {
    const { children } = p
    flag = false
    if (children && children.length) {
      dfsCheckHasOneChildChecked(children)
      if (flag) {
        ids.push(p.id)
      }
    }
  }

  // 去重
  return Array.from(new Set(ids))

  // return ids
}

/**
 * LOG: 举个例子，对于一个存在三级菜单的菜单栏来说，如果选中了三级某个权限的话
 * 那么前端传给后端的数据中也会包含这个一级菜单的权限；需要注意的是，后端接口自身会找
 * 这个三级菜单权限的父权限，也就是二级菜单权限，也就是后，选了一个三级菜单的话
 * 最终落库了三级权限自身、三级权限的二级父权限、三级权限的一级爷级权限
 * 处理接口所返回的数据，不能信任接口所返回的父级菜单的勾选状态，
 * 如果父级菜单是true的话，那么说明它的所有子孙级菜单也必须都是勾选中的，否则就是false
 * 处理接口所返回的数据，不能信任接口返回父级菜单勾选状态数据
 * @param {*} ids : 接口返回的选中权限ID列表
 * @param {*} allPermissions : 所有的权限ID列表
 * @return {Array} : 返回处理后的选中权限ID列表
 */
export const inForApi = (ids, allPermissions) => {
  const checkAllHasCheck = (arr) => {
    let answer = true

    const justdo = (arr) => {
      for (let p of arr) {
        const { children, id } = p
        if (!ids.includes(id)) {
          answer = false
          return true
        }
        if (children && children.length) {
          const returnFlag = justdo(children)
          if (returnFlag) {
            return true
          }
        }
      }
    }

    justdo(arr)

    return answer
  }

  const dfsFindAuthObj = (arr, id) => {
    for (let authItem of arr) {
      const { id, children } = authItem
      if (id === id) {
        return authItem
      }

      const result = dfsFindAuthObj(children, id)
      if (result) {
        return result
      }
    }

    return false
  }

  const finalIds = []
  for (let id of ids) {
    // 找出这个ID所对应的权限对象
    const authObj = dfsFindAuthObj(allPermissions, id)
    const { children } = authObj
    if (!children || children.length === 0) {
      finalIds.push(id)
    } else {
      const result = checkAllHasCheck(children)
      if (result) {
        finalIds.push(id)
      }
    }
  }
  return finalIds
}

const PermissionDFSTree = (props) => {
  allTotalPermissions = props.allPermissionList
  return permissionDfsRender(
    props.value,
    props.allPermissionList,
    props.onChange,
    1
  )
}

export default PermissionDFSTree
