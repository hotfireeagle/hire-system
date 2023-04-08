package router

import (
	"bfe/model"

	"github.com/gin-gonic/gin"
)

func okRes(ctx *gin.Context, data interface{}) {
	res := model.Response{
		Code: model.Success,
		Data: data,
	}
	ctx.JSON(200, res)
}

func errRes(ctx *gin.Context, err string) {
	res := model.Response{
		Code: model.Success,
		Msg:  err,
	}
	ctx.JSON(200, res)
}

func validate(ctx *gin.Context, data interface{}) error {
	if err := ctx.ShouldBindJSON(data); err != nil {
		errRes(ctx, err.Error())
		return err
	}
	return nil
}
