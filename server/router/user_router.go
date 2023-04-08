package router

import (
	"bfe/model"

	"github.com/gin-gonic/gin"
)

func newUserRouter(c *gin.Context) {
	user := new(model.User)
	if validate(c, user) != nil {
		return
	}
	result, err := user.InsertUser()
	if err != nil {
		errRes(c, err.Error())
		return
	}
	okRes(c, result)
}

func fetchAllUserListRouter(c *gin.Context) {
	userList, err := new(model.User).SelectAllUser()
	if err != nil {
		errRes(c, err.Error())
		return
	}
	okRes(c, userList)
}
