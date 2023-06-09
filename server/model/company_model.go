package model

import (
	"time"

	"gorm.io/gorm"
)

type Company struct {
	Id         uint           `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	CreateTime time.Time      `gorm:"column:create_time;autoCreateTime" json:"createTime"`
	UpdateTime time.Time      `gorm:"column:update_time;autoUpdateTime" json:"updateTime"`
	DeleteTime gorm.DeletedAt `gorm:"column:delete_time;index" json:"deleteTime"`
	Name       string         `gorm:"column:name;not null;unique" json:"name"`
	Desc       string         `gorm:"column:desc;not null" json:"desc"`
}
