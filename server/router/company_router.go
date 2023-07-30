package router

import (
	"hire/model"
	"hire/util"

	"github.com/gin-gonic/gin"
)

func NewCompanyRoute(c *gin.Context) {
	company := new(model.Company)

	if validate(c, company) != nil {
		return
	}

	err := model.NewCompany(company)

	if err != nil {
		errRes(c, err.Error())
		return
	}

	randomPassword := util.GeneratePassword()
	okRes(c, randomPassword)
}
