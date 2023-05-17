package model

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

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

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode((logger.Info)),
	})

	if err != nil {
		panic(err)
	}

	DB = db
}
