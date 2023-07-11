package model

import (
	"time"

	"gorm.io/gorm"
)

// 行业类型表

type BusinessType struct {
	Id         uint           `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	CreateTime time.Time      `gorm:"column:create_time;autoCreateTime" json:"createTime"`
	UpdateTime time.Time      `gorm:"column:update_time;autoUpdateTime" json:"updateTime"`
	DeleteTime gorm.DeletedAt `gorm:"column:delete_time;index" json:"deleteTime"`
	Name       string         `gorm:"column:name;not null" json:"name"`
	Company    []Company
}
