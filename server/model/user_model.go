package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	Id        uint           `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	CreatedAt time.Time      `gorm:"column:created_at;autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time      `gorm:"column:updated_at;autoUpdateTime" json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"column:deleted_at;index" json:"deletedAt"`
	Email     string         `gorm:"column:email;unique;not null" binding:"required" json:"email,omitempty"`
	Password  string         `gorm:"column:password;not null" binding:"required" json:"password,omitempty"`
}

func (u *User) InsertUser() (*User, error) {
	result := DB.Create(u)
	return u, result.Error
}

// 根据邮箱找用户对象
func (u *User) SelectUserByEmail(email string) (user User, err error) {
	return user, DB.Where("email = ?", email).Find(&user).Error
}

func SelectUserById(id string) (user User, err error) {
	return user, DB.Select("email").Where("id = ?", id).Find(&user).Error
}
