package main

import (
	"hire/router"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// r.Use(cors.New(cors.Config{
	// 	AllowOrigins:     []string{"http://localhost:3009"},
	// 	AllowMethods:     []string{"PUT", "PATCH"},
	// 	AllowHeaders:     []string{"Origin", "token"},
	// 	ExposeHeaders:    []string{"Content-Length"},
	// 	AllowCredentials: true,
	// 	MaxAge:           12 * time.Hour,
	// }))

	router.InitRouter(r)

	r.Run(":8081")
}
