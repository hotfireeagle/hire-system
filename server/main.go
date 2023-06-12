package main

import (
	"hire/router"
	"hire/util"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.StaticFS("/api/static", http.Dir(util.Static_dir))

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:8341"},
		AllowCredentials: true,
		AllowHeaders:     []string{"Content-Type", "token"},
		MaxAge:           12 * time.Hour,
	}))

	router.InitRouter(r)

	r.Run(":8081")
}
