package router

import (
	"hire/model"

	"github.com/gin-gonic/gin"
)

func queryBannerListRoute(c *gin.Context) {
	queryData := new(model.QueryBannerListRequestBody)
	if validate(c, queryData) != nil {
		return
	}

	res, err := model.QueryBannerList(queryData)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, res)
}

func queryAllBannerRoute(c *gin.Context) {
	allBanners, err := model.QueryAllBanners()
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, allBanners)
}

func createBannerRoute(c *gin.Context) {
	banner := new(model.Banner)
	if validate(c, banner) != nil {
		return
	}

	err := model.InsertBanner(banner)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, "")
}

func updateBannerRoute(c *gin.Context) {
	banner := new(model.Banner)
	if validate(c, banner) != nil {
		return
	}

	err := model.UpdateBanner(banner)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, "")
}

func deleteBannerRoute(c *gin.Context) {
	id := c.Param("bannerId")
	err := model.DeleteBanner(id)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	okRes(c, "")
}
