package router

import (
	"hire/model"
	"hire/util"

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
	roleObj := new(model.RoleUIMeta)
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

func getRoleDetailRouter(c *gin.Context) {
	roleId := c.Param("roleId")
	if roleId == "" {
		errRes(c, "缺少角色ID")
		return
	}

	res, err := model.SelectRoleDetail(roleId)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	roleDetail := model.RoleUIMeta{
		Id:   res.Id,
		Name: res.Name,
		Desc: res.Desc,
		Permissions: util.MapSlice(res.Permissions, func(perm model.Permission) uint {
			return perm.Id
		}),
	}

	okRes(c, roleDetail)
}

func updateRoleRoute(c *gin.Context) {
	roleObj := new(model.RoleUIMeta)
	if validate(c, roleObj) != nil {
		return
	}
	if roleObj.Id == 0 {
		errRes(c, "缺少详情ID")
		return
	}

	err := model.UpdateRole(roleObj)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, "")
}

func getAllRolesRoute(c *gin.Context) {
	res, err := model.SelectAllRoles()
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, res)
}

func deleteRoleRoute(c *gin.Context) {
	roleId := c.Param("roleId")
	if roleId == "" {
		errRes(c, "缺少角色ID")
		return
	}

	err := model.DeleteRole(roleId)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, "")
}
