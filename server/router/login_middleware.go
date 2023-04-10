package router

import (
	"bfe/model"
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
)

func loginValidator() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("token")

		fmt.Println("???????", tokenString)

		if tokenString == "" {
			unLoginRes(c, "请先登录")
			c.Abort()
			return
		}

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
