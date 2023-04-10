package router

import (
	"bfe/model"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func newUserRouter(c *gin.Context) {
	user := new(model.User)
	if validate(c, user) != nil {
		return
	}

	resultByte, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	user.Password = string(resultByte)

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

func userLoginRouter(c *gin.Context) {
	userObj := new(model.User)

	if validate(c, userObj) != nil {
		return
	}

	dbUser, err := userObj.SelectUserByEmail(userObj.Email)

	if err != nil {
		errRes(c, err.Error())
		return
	}

	if dbUser.Email == "" {
		// 表示查询不到该记录
		errRes(c, "不存在此用户")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(userObj.Password))

	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, dbUser)
}
