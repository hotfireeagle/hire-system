package router

import "github.com/gin-gonic/gin"

// 注册整个应用的路由
func InitRouter(c *gin.Engine) {
	apiGroup := c.Group("/api")

	userGroup := apiGroup.Group("/user")
	userGroup.POST("/new", newUserRouter)
	userGroup.POST("/login", userLoginRouter)
	userGroup.GET("/detail", loginValidator(), fetchUserDetailRouter)
}
