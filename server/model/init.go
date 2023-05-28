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
	newPermission("角色管理", "权限管理", "", "")
	newPermission("查看角色列表", "角色管理", "/api/ope/permission/role/list", "POST")
	newPermission("新增角色", "角色管理", "/api/ope/permission/role/new", "POST")
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
	)
}
