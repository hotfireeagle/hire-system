package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email    string `gorm:"column:email;unique;not null" binding:"required"`
	Password string `gorm:"column:password;not null" binding:"required"`
}

func (u User) TableName() string {
	return "user"
}

func (u *User) InsertUser() (*User, error) {
	result := DB.Create(u)
	return u, result.Error
}

// 根据邮箱找用户对象
func (u *User) SelectUserByEmail(email string) (user User, err error) {
	return user, DB.Where("email = ?", email).Find(&user).Error
}

func SelectUserById(uuid string) (user User, err error) {
	return user, DB.Select("email").Where("id = ?", uuid).Find(&user).Error
}
