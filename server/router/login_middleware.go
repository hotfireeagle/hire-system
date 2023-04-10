package router

import (
	"bfe/model"
	"strconv"

	"github.com/gin-gonic/gin"
)

func loginValidator() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("token")

		uid, err := model.VerifyToken(tokenString)

		if err != nil {
			unLoginRes(c, err.Error())
			c.Abort()
			return
		}

		c.Header("uuid", strconv.FormatUint(uint64(uid), 10))

		c.Next()
	}
}
