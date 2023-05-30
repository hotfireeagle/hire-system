package router

import (
	"hire/model"

	"github.com/gin-gonic/gin"
)

var whiteLoginApiMap map[string]bool = map[string]bool{
	"/api/ope/user/login": true,
	"/api/ope/user/new":   true,
}
var whitePermissionApiMap map[string]bool = map[string]bool{
	"/api/ope/user/login":  true,
	"/api/ope/user/new":    true,
	"/api/ope/user/detail": true,
}

func loginValidator() gin.HandlerFunc {
	return func(c *gin.Context) {
		uri := c.Request.URL.RequestURI()

		if whiteLoginApiMap[uri] {
			c.Next()
			return
		}

		tokenString := c.GetHeader("token")

		if tokenString == "" {
			unLoginRes(c, "请先登录")
			c.Abort()
			return
		}

		email, err := model.VerifyToken(tokenString)

		if err != nil {
			unLoginRes(c, err.Error())
			c.Abort()
			return
		}

		c.Set("email", email)

		c.Next()
	}
}

func permissionValidator() gin.HandlerFunc {
	return func(c *gin.Context) {
		uri := c.FullPath()

		if whitePermissionApiMap[uri] {
			c.Next()
			return
		}

		emailStr := c.GetString("email")
		if emailStr == "" {
			unLoginRes(c, "未登录")
			c.Abort()
			return
		}

		method := c.Request.Method

		ok, err := model.ValidatePermission(emailStr, uri, method)

		if err != nil {
			errRes(c, err.Error())
			c.Abort()
			return
		}

		if !ok {
			unAuthRes(c)
			c.Abort()
			return
		}

		c.Next()
	}
}
