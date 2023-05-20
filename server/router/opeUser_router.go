package router

import (
	"hire/model"

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
