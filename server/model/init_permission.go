package model

func initPermission() {
	newPermission("权限管理", "", "", "")
	newPermission("角色管理", "权限管理", "", "")
	newPermission("查看角色列表", "角色管理", "/api/ope/permission/role/list", "POST")
	newPermission("新增角色", "角色管理", "/api/ope/permission/role/new", "POST")
}
