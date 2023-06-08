package router

import (
	"hire/model"
	"strconv"

	"github.com/gin-gonic/gin"
)

func queryCategoryListRoute(c *gin.Context) {
	allCategoryList, err := model.SelectAllCategory()
	if err != nil {
		errRes(c, err.Error())
		return
	}

	answer := make([]*model.CategoryTreeNode, 0)
	topIds := make([]uint, 0)
	id2categoryMap := make(map[uint]*model.CategoryTreeNode)

	for _, cate := range allCategoryList {
		if cate.ParentId == model.RootCategoryId {
			// 顶级分类
			topIds = append(topIds, cate.Id)
		}
		cateItem := &model.CategoryTreeNode{
			Id:          cate.Id,
			ParentId:    cate.ParentId,
			Name:        cate.Name,
			IsRecommend: cate.IsRecommend,
			Children:    make([]*model.CategoryTreeNode, 0),
		}
		id2categoryMap[cate.Id] = cateItem
	}

	for _, cate := range allCategoryList {
		if cate.ParentId != model.RootCategoryId {
			parentNode := id2categoryMap[cate.ParentId]
			parentNode.Children = append(parentNode.Children, id2categoryMap[cate.Id])
		}
	}

	for _, id := range topIds {
		answer = append(answer, id2categoryMap[id])
	}

	okRes(c, answer)
}

func createCategoryRoute(c *gin.Context) {
	categoryObj := new(model.Category)
	if validate(c, categoryObj) != nil {
		return
	}

	if err := model.SaveCategory(categoryObj); err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, "")
}

func updateCategoryRoute(c *gin.Context) {
	categoryObj := new(model.Category)
	if validate(c, categoryObj) != nil {
		return
	}

	if err := model.UpdateCategory(categoryObj); err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, "")
}

func deleteCategoryRoute(c *gin.Context) {
	id := c.Param("categoryId")

	if err := model.DeleteCategory(id); err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, "")
}

func updateCategoryIsRecommendRoute(c *gin.Context) {
	categoryId := c.Param("categoryId")
	recommendStringValue := c.Param("recommendValue")
	intRecommendValue, err := strconv.Atoi(recommendStringValue)

	if err != nil {
		errRes(c, err.Error())
		return
	}

	err = model.UpdateCategoryRecommendValue(categoryId, intRecommendValue)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, "")
}
