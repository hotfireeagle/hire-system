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

func (u *User) SelectAllUser() (users []User, err error) {
	return users, DB.Find(&users).Error
}
