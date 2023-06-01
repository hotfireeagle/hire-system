package router

import "github.com/gin-gonic/gin"

// 注册整个应用的路由
func InitRouter(c *gin.Engine) {
	apiGroup := c.Group("/api")
	webGroup := apiGroup.Group("/web")                                          // 前台页面路由路径
	opeGroup := apiGroup.Group("/ope", loginValidator(), permissionValidator()) // 后台管理系统路由路径 TODO: permissionCheck中间件

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

	// 后台管理系统权限模块
	permissionGroup := opeGroup.Group("/permission")
	permissionGroup.POST("/tree", getPermissionTreeRouter)

	permissionRoleGroup := permissionGroup.Group("/role")
	permissionRoleGroup.POST("/list", getRoleListRouter)
	permissionRoleGroup.POST("/new", newRoleRouter)
	permissionRoleGroup.GET("/detail/:roleId", getRoleDetailRouter)
	permissionRoleGroup.POST("/update", updateRoleRoute)
	permissionRoleGroup.GET("/all", getAllRolesRoute)
	permissionRoleGroup.GET("/delete/:roleId", deleteRoleRoute)

	permissionAccountGroup := permissionGroup.Group("/account")
	permissionAccountGroup.POST("/list", fetchOpeUserListRoute)
	permissionAccountGroup.POST("/new", newOpeUserRoute)
	permissionAccountGroup.GET("/detail/:id", fetchOpeUserDetailRoute)
	permissionAccountGroup.POST("/update", updateOpeUserRoute)
	permissionAccountGroup.GET("/resetPassword", resetOpeUserPasswordRoute)
}
