package model

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	secretKey                     = []byte("demo_use_big_frontend_developer_rookie")
	tokenExpireTime time.Duration = 1
)

// 生成token
func GenerateToken(uuid uint) (string, error) {
	// 用HS256加密方式去生成token
	token := jwt.New(jwt.SigningMethodHS256)

	// 填充claims数据
	claims := token.Claims.(jwt.MapClaims)
	claims["uuid"] = uuid
	claims["exp"] = time.Now().Add(time.Second * tokenExpireTime).Unix()

	return token.SignedString(secretKey)
}

func VerifyToken(tokenString string) (uint, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("wrong method")
		}
		return secretKey, nil
	})

	if err != nil {
		return 0, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); !ok {
		return 0, errors.New("wrong token type")
	} else {
		if !token.Valid {
			return 0, errors.New("invalid token")
		}

		uid, ok := claims["uuid"].(uint)
		if !ok {
			return 0, errors.New("wrong uuid tyoe")
		}

		return uid, nil
	}
}
