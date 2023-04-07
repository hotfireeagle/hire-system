package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email    string `gorm:"column:email;unique;not null"`
	Password string `gorm:"column:password;not null"`
}

func (u User) TableName() string {
	return "user"
}

func (u *User) InsertUser() (*User, error) {
	result := DB.Create(u)
	return u, result.Error
}
