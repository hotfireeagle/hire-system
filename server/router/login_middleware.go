package router

import (
	"hire/model"

	"github.com/gin-gonic/gin"
)

func loginValidator() gin.HandlerFunc {
	return func(c *gin.Context) {
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
