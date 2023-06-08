package model

import (
	"fmt"
	"os"

	"github.com/casbin/casbin/v2"
	"github.com/casbin/casbin/v2/model"
	xormadapter "github.com/casbin/xorm-adapter/v2"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB
var casbinEnforcer *casbin.Enforcer

func init() {
	err := godotenv.Load()

	if err != nil {
		panic(err)
	}

	user := os.Getenv("MYSQL_USER")
	password := os.Getenv("MYSQL_PASSWORD")
	domain := os.Getenv("MYSQL_DOMAIN")
	port := os.Getenv("MYSQL_PORT")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/hire?charset=utf8mb4&parseTime=True&loc=Local", user, password, domain, port)
	casbinDsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/hire", user, password, domain, port)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode((logger.Info)),
	})

	if err != nil {
		panic(err)
	}

	DB = db

	initTable()
	initCasbin(casbinDsn)
	initPermission()
}

func initPermission() {
	newPermission("权限管理", "", "", "")
	newPermission("banner管理", "", "", "")
	newPermission("配置管理", "", "", "")

	newPermission("角色管理", "权限管理", "", "")
	newPermission("成员管理", "权限管理", "", "")
	newPermission("查看权限树列表", "权限管理", "/api/ope/permission/tree", "POST")

	newPermission("分类配置", "配置管理", "", "")
	newPermission("豆腐块配置", "配置管理", "", "")

	newPermission("查看角色列表", "角色管理", "/api/ope/permission/role/list", "POST")
	newPermission("新增角色", "角色管理", "/api/ope/permission/role/new", "POST")
	newPermission("查看角色详情", "角色管理", "/api/ope/permission/role/detail/:roleId", "GET")
	newPermission("更新角色", "角色管理", "/api/ope/permission/role/update", "POST")
	newPermission("获取所有角色列表", "角色管理", "/api/ope/permission/role/all", "GET")
	newPermission("删除角色", "角色管理", "/api/ope/permission/role/delete/:roleId", "GET")

	newPermission("查看成员列表", "成员管理", "/api/ope/permission/account/list", "POST")
	newPermission("新增成员", "成员管理", "/api/ope/permission/account/new", "POST")
	newPermission("查看成员详情", "成员管理", "/api/ope/permission/account/detail/:id", "GET")
	newPermission("更新成员", "成员管理", "/api/ope/permission/account/update", "POST")
	newPermission("重置成员密码", "成员管理", "/api/ope/permission/account/resetPassword/:id", "GET")

	newPermission("获取banner列表", "banner管理", "/api/ope/banner/list", "GET")
	newPermission("新建banner", "banner管理", "/api/ope/banner/new", "POST")
	newPermission("更新banner", "banner管理", "/api/ope/banner/update", "POST")
	newPermission("删除banner", "banner管理", "/api/ope/banner/delete/:bannerId", "GET")

	newPermission("获取分类列表", "分类配置", "/api/ope/configure/category/list", "GET")
	newPermission("新建分类", "分类配置", "/api/ope/configure/category/new", "POST")
	newPermission("更新分类", "分类配置", "/api/ope/configure/category/update", "POST")
	newPermission("删除分类", "分类配置", "/api/ope/configure/category/delete/:categoryId", "GET")
	newPermission("设置分类是否推荐", "分类配置", "/api/ope/configure/category/updateRecommend/:categoryId/:recommendValue", "GET")

	newPermission("获取豆腐块列表", "豆腐块配置", "/api/ope/configure/tofucube/list", "GET")
	newPermission("新增豆腐块", "豆腐块配置", "/api/ope/configure/tofucube/new", "POST")
	newPermission("更新豆腐块", "豆腐块配置", "/api/ope/configure/tofucube/update", "POST")
}

func initCasbin(dsn string) {
	a, err := xormadapter.NewAdapter("mysql", dsn, true)
	if err != nil {
		panic(err)
	}

	m, err := model.NewModelFromString(`
		[request_definition]
		r = sub, obj, act
		
		[policy_definition]
		p = sub, obj, act
		
		[role_definition]
		g = _, _
		
		[policy_effect]
		e = some(where (p.eft == allow))
		
		[matchers]
		m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
	`)

	if err != nil {
		panic(err)
	}

	en, err := casbin.NewEnforcer(m, a)

	casbinEnforcer = en

	if err != nil {
		panic(err)
	}
}

func initTable() {
	DB.AutoMigrate(
		&OpeUser{},
		&Permission{},
		&Role{},
		&User{},
		&Banner{},
		&Category{},
		&ToFuCube{},
	)
}
