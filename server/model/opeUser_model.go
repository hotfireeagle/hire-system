package model

import "time"

// 后台用户表
type OpeUser struct {
	Id         uint      `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	CreateTime time.Time `gorm:"column:create_time;autoCreateTime" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;autoUpdateTime" json:"updateTime,omitempty"`
	DeleteTime time.Time `gorm:"column:delete_time;index" json:"deleteTime,omitempty"`
	Email      string    `gorm:"column:email;unique;not null" binding:"required" json:"email,omitempty"`
	Password   string    `gorm:"column:password;not null" binding:"required" json:"password,omitempty"`
}

func (o OpeUser) TableName() string {
	return "ope_user"
}
