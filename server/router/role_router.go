package router

import (
	"hire/model"

	"github.com/gin-gonic/gin"
)

func getRoleListRouter(c *gin.Context) {
	queryData := new(model.QueryRoleListReqeustBody)
	if validate(c, queryData) != nil {
		return
	}

	res, err := model.SelectRoleList(queryData)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, res)
}

func newRoleRouter(c *gin.Context) {
	roleObj := new(model.NewRoleRequestBody)
	if validate(c, roleObj) != nil {
		return
	}

	err := model.NewRole(roleObj)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, "")
}
