package router

import (
	"hire/model"

	"github.com/gin-gonic/gin"
)

func getPermissionTreeRouter(c *gin.Context) {
	queryData := new(model.QueryPermissionListRequestParam)
	if validate(c, queryData) != nil {
		return
	}

	list, err := model.SelectPermissionList(queryData)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	answer := make([]*model.QueryPermissionTreeResponseData, 0)
	topParentId := make([]uint, 0)
	cacheMap := make(map[uint]*model.QueryPermissionTreeResponseData)

	for _, permissionObj := range *list {
		if permissionObj.ParentId == 0 {
			topParentId = append(topParentId, permissionObj.Id)
		}
		children := make([]*model.QueryPermissionTreeResponseData, 0)
		cacheMap[permissionObj.Id] = &model.QueryPermissionTreeResponseData{
			Id:       permissionObj.Id,
			ParentId: permissionObj.ParentId,
			Name:     permissionObj.Name,
			Children: &children,
		}
	}
	for _, permissionObj := range *list {
		if permissionObj.ParentId == 0 {
			continue
		}
		if parentPermission, ok := cacheMap[permissionObj.ParentId]; ok {
			*parentPermission.Children = append(*parentPermission.Children, cacheMap[permissionObj.Id])
			cacheMap[permissionObj.ParentId] = parentPermission
		}
	}
	for _, topId := range topParentId {
		answer = append(answer, cacheMap[topId])
	}

	okRes(c, answer)
}
