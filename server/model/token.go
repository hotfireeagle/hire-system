package model

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	secretKey                       = []byte("demo_use_big_frontend_developer_rookie")
	tokenExpireSecond time.Duration = 24 * 60 * 60 // 24 hour
)

// 生成token
func GenerateToken(email string) (string, error) {
	// 用HS256加密方式去生成token
	token := jwt.New(jwt.SigningMethodHS256)

	// 填充claims数据
	claims := token.Claims.(jwt.MapClaims)
	claims["email"] = email
	claims["exp"] = time.Now().Add(time.Second * tokenExpireSecond).Unix()

	return token.SignedString(secretKey)
}

func VerifyToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("wrong method")
		}
		return secretKey, nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); !ok {
		return "", errors.New("wrong token type")
	} else {
		if !token.Valid {
			return "", errors.New("invalid token")
		}

		strV, _ := claims["email"].(string)

		return strV, nil
	}
}
