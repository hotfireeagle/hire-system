package model

import (
	"github.com/casbin/casbin/v2"
	"github.com/casbin/casbin/v2/model"
	xormadapter "github.com/casbin/xorm-adapter/v2"
	_ "github.com/go-sql-driver/mysql"
)

var casbinEnforcer *casbin.Enforcer

func initCasbinPolicy(dsn string) {
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
