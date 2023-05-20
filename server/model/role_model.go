package model

import "time"

// 角色表
type Role struct {
	Id         uint      `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	CreateTime time.Time `gorm:"column:create_time;autoCreateTime" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;autoUpdateTime" json:"updateTime,omitempty"`
	DeleteTime time.Time `gorm:"column:delete_time;index" json:"deleteTime,omitempty"`
	Name       string    `gorm:"column:name;not null" json:"name"`
	Desc       string    `gorm:"column:desc" json:"desc"`
	CreatorId  uint      `gorm:"column:creator_id;not null" json:"creatorId"`
}

func (r Role) TableName() string {
	return "role"
}
