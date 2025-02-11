import { PageContainer } from "@ant-design/pro-components"
import { Card, message, Empty, Popconfirm, Alert, Tooltip } from "antd"
import { useState, useEffect } from "react"
import request from "@/utils/request"
import PropTypes from "prop-types"
import { DeleteOutlined, EditOutlined, PlusSquareOutlined, FireOutlined } from "@ant-design/icons"
import ModalForm from "@/components/modalForm"
import styles from "./index.less"

const recommendCategory = 1

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
        <Alert message="橙色：热门搜索分类，将会出现在首页搜索栏下方的推荐关键词中" type="info" className={styles.mb15} />
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

  // 更新推荐规则时触发
  const updateRecommendHandler = categoryObject => {
    const nextValue = 1 - Number(categoryObject.isRecommend)
    const url = `/configure/category/updateRecommend/${categoryObject.id}/${nextValue}`
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
                  className={`
                    ${styles.rowItemCls}
                    ${activeIdx == idx ? styles.activeRowItemCls : ""}
                    ${categoryObj.isRecommend === recommendCategory ? styles.recommendRowItemCls : ""}
                  `}
                  onClick={() => setActiveIdx(idx)}
                >
                  <span>{categoryObj.name}</span>
                  <div className={styles.operateable}>
                    <Popconfirm
                      title="删除该分类"
                      description="删除该分类后，它所关联的数据展示分类将会出现问题"
                      onConfirm={() => deleteHandler(categoryObj)}
                      okText="删除"
                      cancelText="取消"
                    >
                      <DeleteOutlined className={styles.mr6} />
                    </Popconfirm>
                    <Tooltip title="编辑">
                      <EditOutlined className={styles.mr6} onClick={() => editHandler(categoryObj)} />
                    </Tooltip>
                    <Tooltip title="新增子类别">
                      <PlusSquareOutlined className={styles.mr6} onClick={() => newHandler(false)} />
                    </Tooltip>
                    <Tooltip title="设置该类别为热门类别，将会显示在首页搜索栏下面">
                      <FireOutlined onClick={() => updateRecommendHandler(categoryObj)} />
                    </Tooltip>
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