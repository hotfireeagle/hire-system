package model

import (
	"time"

	"gorm.io/gorm"
)

// 后台用户表
type OpeUser struct {
	Id         uint           `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	CreateTime time.Time      `gorm:"column:create_time;autoCreateTime" json:"createTime"`
	UpdateTime time.Time      `gorm:"column:update_time;autoUpdateTime" json:"updateTime,omitempty"`
	DeleteTime gorm.DeletedAt `gorm:"column:delete_time;index" json:"deleteTime,omitempty"`
	Email      string         `gorm:"column:email;unique;not null" binding:"required" json:"email,omitempty"`
	Password   string         `gorm:"column:password;not null" binding:"required" json:"password,omitempty"`
}

func (o OpeUser) TableName() string {
	return "ope_user"
}

// 创建一个后台用户
func NewOpeUser(opeUserObj *OpeUser) error {
	err := DB.Create(&opeUserObj).Error
	return err
}

// 根据邮箱查找出后台用户
func FindOpeUserByEmail(email string) (user *OpeUser, err error) {
	return user, DB.Where("email = ?", email).First(&user).Error
}
