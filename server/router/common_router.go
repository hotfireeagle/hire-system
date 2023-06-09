package router

import (
	"hire/util"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func uploadRoute(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		errRes(c, err.Error())
		return
	}

	filetype := filepath.Ext(file.Filename)
	newFileName := uuid.NewString() + filetype
	filePath := util.Static_dir + newFileName

	err = c.SaveUploadedFile(file, filePath)
	if err != nil {
		errRes(c, err.Error())
		return
	}

	urlPath := "/api/static/" + newFileName

	okRes(c, urlPath)
}
