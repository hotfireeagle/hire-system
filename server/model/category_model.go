package model

import (
	"time"

	"gorm.io/gorm"
)

type Category struct {
	Id         uint           `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	ParentId   uint           `gorm:"column:parent_id;not null" json:"parentId" binding:"required"`
	Name       string         `gorm:"column:name;not null;unique" json:"name" binding:"required"`
	CreateTime time.Time      `gorm:"column:create_time;autoCreateTime" json:"createTime"`
	UpdateTime time.Time      `gorm:"column:update_time;autoUpdateTime" json:"updateTime"`
	DeleteTime gorm.DeletedAt `gorm:"column:delete_time;index" json:"deleteTime"`
}

func SaveCategory(category *Category) error {
	return DB.Create(category).Error
}

func UpdateCategory(category *Category) error {
	return DB.Model(&Category{}).Select("parentId", "name").Updates(category).Error
}

func DeleteCategory(id string) error {
	return DB.Model(&Category{}).Update("delete_time", time.Now()).Error
}
