package router

import (
	"hire/model"
	"hire/util"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// 后台用户注册的路由
func opeUserRegisterRouter(c *gin.Context) {
	opeUser := new(model.OpeUser)
	if validate(c, opeUser) != nil {
		return
	}

	resultByte, err := bcrypt.GenerateFromPassword([]byte(opeUser.Password), bcrypt.DefaultCost)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	opeUser.Password = string(resultByte)

	err = model.NewOpeUser(opeUser)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, "")
}

// 后台用户进行登录操作的路由
func opeUserLoginRouter(c *gin.Context) {
	opeUser := new(model.OpeUser)
	if validate(c, opeUser) != nil {
		return
	}

	dbUser, err := model.FindOpeUserByEmail(opeUser.Email)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(opeUser.Password))
	if err != nil {
		errRes(c, err.Error())
		return
	}

	token, err := model.GenerateToken(dbUser.Email)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, token)
}

// 后台用户利用token查询详情信息
func opeUserFetchDetailRouter(c *gin.Context) {
	email := c.GetString("email")

	dbUser, err := model.FindOpeUserByEmail(email)

	if err != nil {
		errRes(c, err.Error())
		return
	}

	permissions, err := model.SelectPermissionList(&model.QueryPermissionListRequestParam{})
	if err != nil {
		errRes(c, err.Error())
		return
	}

	if dbUser.CheckIsRoot() {
		var strPermission []string
		for _, permissionObj := range *permissions {
			strPermission = append(strPermission, permissionObj.Name)
		}

		okRes(c, strPermission)
		return
	}

	// TODO: 优化代码，尽可能通过sql去做更多的事
	userOwnRoles, err := model.FindOpeUserOwnRoles(email)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	ownLeafPermissionMap := make(map[uint]model.Permission)
	for _, roleObj := range userOwnRoles {
		for _, permissionObj := range roleObj.Permissions {
			ownLeafPermissionMap[permissionObj.Id] = permissionObj
		}
	}

	permissionIdMap := make(map[uint]model.Permission)
	for _, perm := range *permissions {
		permissionIdMap[perm.Id] = perm
	}

	var findParent = func(id uint) uint {
		perm := permissionIdMap[id]
		return perm.ParentId
	}

	ownAllPermissionMap := make(map[uint]struct{}, 0)
	for perId := range ownLeafPermissionMap {
		ownAllPermissionMap[perId] = struct{}{}
		// 查perId的上级别，上上级
		parentId := findParent(perId)
		for parentId != 0 {
			ownAllPermissionMap[parentId] = struct{}{}
			parentId = findParent(parentId)
		}
	}

	finalAnswer := make([]string, 0)
	for pid := range ownAllPermissionMap {
		finalAnswer = append(finalAnswer, permissionIdMap[pid].Name)
	}

	okRes(c, finalAnswer)
}

func fetchOpeUserListRoute(c *gin.Context) {
	query := new(model.QueryOpeUserListRequestBody)
	if validate(c, query) != nil {
		return
	}

	result, err := model.SelectOpeUserList(query)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, result)
}

func newOpeUserRoute(c *gin.Context) {
	postData := new(model.NewOpeUserRequestBody)
	if validate(c, postData) != nil {
		return
	}
	if len(postData.Roles) == 0 {
		errRes(c, "缺少角色数据")
		return
	}

	password, err := model.InsertOpeUser(postData)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, password)
}

func fetchOpeUserDetailRoute(c *gin.Context) {
	id := c.Param("id")
	user, err := model.FindOpeUserDetailById(id)

	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, model.OpeUser2UI(&user))
}

func updateOpeUserRoute(c *gin.Context) {
	postData := new(model.NewOpeUserRequestBody)
	if validate(c, postData) != nil {
		return
	}

	if len(postData.Roles) == 0 {
		errRes(c, "请指定角色")
		return
	}

	err := model.UpdateOpeUser(postData)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, "")
}

func resetOpeUserPasswordRoute(c *gin.Context) {
	email := c.GetString("email")

	randomPassword := util.GeneratePassword()
	resultByte, err := bcrypt.GenerateFromPassword([]byte(randomPassword), bcrypt.DefaultCost)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	newPassword := string(resultByte)
	err = model.UpdateOpeUserPassword(email, newPassword)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, randomPassword)
}
