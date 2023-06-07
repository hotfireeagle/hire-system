package model

import (
	"time"

	"gorm.io/gorm"
)

type ToFuCube struct {
	Id         uint           `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	CreateTime time.Time      `gorm:"column:create_time;autoCreateTime" json:"createTime"`
	UpdateTime time.Time      `gorm:"column:update_time;autoUpdateTime" json:"updateTime"`
	DeleteTime gorm.DeletedAt `gorm:"column:delete_time;index" json:"deleteTime"`
	Position   string         `gorm:"column:position;unique" json:"position" binding:"required"`
	Url        string         `gorm:"column:url;not null" json:"url" binding:"required"`
	JumpUrl    string         `gorm:"column:jump_url;not null" json:"jumpUrl"`
}

func SaveToFuCube(tofu *ToFuCube) error {
	return DB.Create(tofu).Error
}

func UpdateToFuCube(tofu *ToFuCube) error {
	return DB.Model(tofu).Select("url", "jump_url").Updates(tofu).Error
}

func DeleteToFuCube(id string) error {
	return DB.Model(&ToFuCube{}).Where("id = ?", id).Update("delete_time", time.Now()).Error
}

func QueryToFuList() (tufus []ToFuCube, err error) {
	return tufus, DB.Order("id").Find(&tufus).Error
}
