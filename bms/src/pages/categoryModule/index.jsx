import { PageContainer } from "@ant-design/pro-components"
import { Card, message, Empty } from "antd"
import { useState, useEffect } from "react"
import request from "@/utils/request"
import PropTypes from "prop-types"
import { DeleteOutlined, EditOutlined, PlusSquareOutlined } from "@ant-design/icons"
import ModalForm from "@/components/modalForm"
import styles from "./index.less"

const CategoryModule = () => {
  const [reload, setReload] = useState(false)
  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    request("/configure/category/list", {}, "get").then(res => {
      setCategoryList(res)
    })
  }, [reload])

  return (
    <PageContainer>
      <Card>
        <CategoryTree
          level={1}
          categoryArr={categoryList}
          reloadHandler={() => setReload(!reload)}
        />
      </Card>
    </PageContainer>
  )
}

const CategoryTree = props => {
  const { level, categoryArr } = props
  const [activeIdx, setActiveIdx] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [initCategory, setInitCategory] = useState({})
  const [isSameLevel, setIsSameLevel] = useState(false)

  const nextLevelCategoryList = categoryArr?.[activeIdx]?.children || []
  const nextLevel = level + 1
  const activeCategoryObj = categoryArr?.[activeIdx] || {}

  const editForm = [
    {
      label: "名称",
      type: "input",
      key: "name",
    }
  ]

  const renderCardTitle = () => {
    const title = `${level}级类目`
    if (level != 1) {
      return title
    }

    const clickHandler = event => {
      event.preventDefault()
      newHandler(true)
    }

    return (
      <div className={styles.header}>
        <span>{title}</span>
        <a onClick={clickHandler} href="#" className={styles.smallFontCls}>新建一级类目</a>
      </div>
    )
  }

  const newHandler = isCurrentLevel => {
    setIsSameLevel(isCurrentLevel)
    setInitCategory({})
    setShowModal(true)
  }

  const editHandler = obj => {
    setInitCategory(obj)
    setShowModal(true)
  }

  const checkIsEditCategory = () => initCategory.id

  const newOrUpdateCategoryHandler = values => {
    const postData = {
      ...(initCategory || {}),
      ...values,
    }
    let url = "/configure/category/new"
    if (checkIsEditCategory()) {
      url = "/configure/category/update"
    }

    if (isSameLevel) {
      postData.parentId = 0
    } else {
      postData.parentId = activeCategoryObj.id
    }

    return request(url, postData, "post").then(() => {
      message.success("操作成功")
      props.reloadHandler()
    })
  }

  const deleteHandler = cateObj => {
    const url = `/configure/category/delete/${cateObj.id}`
    request(url, {}, "get").then(() => {
      message.success("操作成功")
      props.reloadHandler()
    })
  }

  if (level != 1 && !categoryArr?.length) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      <Card title={renderCardTitle()}>
        {
          categoryArr.length ? 
            categoryArr.map((categoryObj, idx) => {
              return (
                <div
                  key={categoryObj.id}
                  className={`${styles.rowItemCls} ${activeIdx == idx ? styles.activeRowItemCls : ""}`}
                  onClick={() => setActiveIdx(idx)}
                >
                  <span>{categoryObj.name}</span>
                  <div>
                    <DeleteOutlined className={styles.mr6} onClick={() => deleteHandler(categoryObj)} />
                    <EditOutlined className={styles.mr6} onClick={() => editHandler(categoryObj)} />
                    <PlusSquareOutlined onClick={() => newHandler(false)} />
                  </div>
                </div>
              )
            }) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )
        }
      </Card>
      <CategoryTree
        {...props}
        level={nextLevel}
        categoryArr={nextLevelCategoryList}
      />

      <ModalForm
        title={checkIsEditCategory() ? "更新分类" : "新建分类"}
        visible={showModal}
        formList={editForm}
        initValue={initCategory}
        onOk={newOrUpdateCategoryHandler}
        onCancel={() => setShowModal(false)}
      />
    </div>
  )
}

CategoryTree.propTypes = {
  level: PropTypes.number,
  categoryArr: PropTypes.array,
  reloadHandler: PropTypes.func,
}

export default CategoryModule