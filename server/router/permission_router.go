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

	okRes(c, list)
}
