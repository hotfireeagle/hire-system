package util

import (
	"math/rand"
	"strings"
	"time"
)

const (
	lowerCharSet   = "abcdedfghijklmnopqrst"
	upperCharSet   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	specialCharSet = "!@#&*"
	numberSet      = "0123456789"
	allCharSet     = lowerCharSet + upperCharSet + specialCharSet + numberSet
)

func MapSlice[T any, M any](arr []T, convertFun func(T) M) []M {
	answer := make([]M, len(arr))

	for idx, item := range arr {
		answer[idx] = convertFun(item)
	}

	return answer
}

func GeneratePassword() string {
	var password strings.Builder
	var (
		passwordLength = 16
		minSpecialChar = 2
		minNum         = 2
		minLowerCase   = 4
		minUpperCase   = 4
	)

	r := rand.New(rand.NewSource(time.Now().Unix()))

	//Set special character
	for i := 0; i < minSpecialChar; i++ {
		random := r.Intn(len(specialCharSet))
		password.WriteString(string(specialCharSet[random]))
	}

	//Set numeric
	for i := 0; i < minNum; i++ {
		random := r.Intn(len(numberSet))
		password.WriteString(string(numberSet[random]))
	}

	//Set uppercase
	for i := 0; i < minUpperCase; i++ {
		random := r.Intn(len(upperCharSet))
		password.WriteString(string(upperCharSet[random]))
	}

	//Set lowercase
	for i := 0; i < minLowerCase; i++ {
		random := r.Intn(len(lowerCharSet))
		password.WriteString(string(lowerCharSet[random]))
	}

	remainingLength := passwordLength - minSpecialChar - minNum - minUpperCase
	for i := 0; i < remainingLength; i++ {
		random := r.Intn(len(allCharSet))
		password.WriteString(string(allCharSet[random]))
	}
	// 转化为 utf8 格式的数组，将数组随机打乱
	inRune := []rune(password.String())
	r.Shuffle(len(inRune), func(i, j int) {
		inRune[i], inRune[j] = inRune[j], inRune[i]
	})
	return string(inRune)
}
