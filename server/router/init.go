package router

import "github.com/gin-gonic/gin"

// 注册整个应用的路由
func InitRouter(c *gin.Engine) {
	apiGroup := c.Group("/api")
	webGroup := apiGroup.Group("/web")                   // 前台页面路由路径
	opeGroup := apiGroup.Group("/ope", loginValidator()) // 后台管理系统路由路径 TODO: permissionCheck中间件

	// 前台网页用户相关接口
	userGroup := webGroup.Group("/user")
	userGroup.POST("/new", newUserRouter)
	userGroup.POST("/login", userLoginRouter)
	userGroup.GET("/detail", loginValidator(), fetchUserDetailRouter)

	// 后台管理系统用户模块
	opeUserGroup := opeGroup.Group("/user")
	opeUserGroup.POST("/new", opeUserRegisterRouter)
	opeUserGroup.POST("/login", opeUserLoginRouter)
	opeUserGroup.GET("/detail", opeUserFetchDetailRouter)

	// 后台管理权限模块
	permissionGroup := opeGroup.Group("/permission")
	permissionGroup.POST("/role/list", getRoleListRouter)
	permissionGroup.POST("/role/new", newRoleRouter)
	permissionGroup.GET("/role/detail/:roleId", getRoleDetailRouter)
	permissionGroup.POST("/role/update", updateRoleRoute)
	permissionGroup.POST("/tree", getPermissionTreeRouter)
}
