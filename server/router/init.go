package router

import "github.com/gin-gonic/gin"

// 注册整个应用的路由
func InitRouter(c *gin.Engine) {
	apiGroup := c.Group("/api")
	webGroup := apiGroup.Group("/web") // 前台页面路由路径
	opeGroup := apiGroup.Group("/ope") // 后台管理系统路由路径

	userGroup := webGroup.Group("/user")
	userGroup.POST("/new", newUserRouter)
	userGroup.POST("/login", userLoginRouter)
	userGroup.GET("/detail", loginValidator(), fetchUserDetailRouter)

	opeUserGroup := opeGroup.Group("/user")
	opeUserGroup.POST("/new", opeUserRegisterRouter)
}
