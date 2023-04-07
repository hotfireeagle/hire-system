package main

import (
	"bfe/router"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()

	if err != nil {
		panic(err)
	}

	r := gin.Default()
	router.InitRouter(r)

	r.Run() // 8080
}
