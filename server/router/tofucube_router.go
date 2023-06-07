package router

import (
	"hire/model"

	"github.com/gin-gonic/gin"
)

func queryTofuListRoute(c *gin.Context) {
	tofus, err := model.QueryToFuList()
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, tofus)
}

func newTofuRoute(c *gin.Context) {
	tofu := new(model.ToFuCube)
	if validate(c, tofu) != nil {
		return
	}

	err := model.SaveToFuCube(tofu)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, "")
}

func updateTofuRoute(c *gin.Context) {
	tofu := new(model.ToFuCube)
	if validate(c, tofu) != nil {
		return
	}

	err := model.UpdateToFuCube(tofu)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, "")
}
