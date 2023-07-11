package model

import (
	"time"

	"gorm.io/gorm"
)

type JobTag struct {
	Id         uint           `gorm:"column:id;primaryKey;autoIncrement;" json:"id"`
	CreateTime time.Time      `gorm:"column:create_time;autoCreateTime" json:"createTime"`
	UpdateTime time.Time      `gorm:"column:update_time;autoUpdateTime" json:"updateTime"`
	DeleteTime gorm.DeletedAt `gorm:"column:delete_time;index" json:"deleteTime"`
	Name       string         `gorm:"column:name;not null" json:"name"`
	Jobs       []Job          `gorm:"many2many:jobs_to_tags" json:"jobs"`
}
