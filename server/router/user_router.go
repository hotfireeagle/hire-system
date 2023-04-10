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

	token, err := model.GenerateToken(result.ID)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, token)
}

func verifyTest(c *gin.Context) {
	token := c.Param("token")
	id, err := model.VerifyToken(token)
	if err != nil {
		errRes(c, err.Error())
		return
	}
	okRes(c, id)
}

func fetchAllUserListRouter(c *gin.Context) {
	userList, err := new(model.User).SelectAllUser()
	if err != nil {
		errRes(c, err.Error())
		return
	}
	okRes(c, userList)
}
