package model

import (
	"time"

	"gorm.io/gorm"
)

var (
	RootCategoryId    uint = 0
	IsNotRecommendVal int  = 0
	IsRecommendVal    int  = 1
)

type Category struct {
	Id          uint           `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	ParentId    uint           `gorm:"column:parent_id;not null" json:"parentId"`
	Name        string         `gorm:"column:name;not null;unique" json:"name" binding:"required"`
	CreateTime  time.Time      `gorm:"column:create_time;autoCreateTime" json:"createTime"`
	UpdateTime  time.Time      `gorm:"column:update_time;autoUpdateTime" json:"updateTime"`
	DeleteTime  gorm.DeletedAt `gorm:"column:delete_time;index" json:"deleteTime"`
	IsRecommend int            `gorm:"column:is_recommend" json:"isRecommend"` // 是否是推荐词
}

type CategoryTreeNode struct {
	Id          uint                `json:"id"`
	ParentId    uint                `json:"parentId"`
	Name        string              `json:"name"`
	Children    []*CategoryTreeNode `json:"children"`
	IsRecommend int                 `json:"isRecommend"`
}

func SaveCategory(category *Category) error {
	return DB.Create(category).Error
}

func UpdateCategory(category *Category) error {
	return DB.Model(category).Select("parentId", "name").Updates(category).Error
}

func DeleteCategory(id string) error {
	return DB.Model(&Category{}).Where("id = ?", id).Update("delete_time", time.Now()).Error
}

func SelectAllCategory() (categoryList []Category, err error) {
	return categoryList, DB.Where("delete_time is null").Find(&categoryList).Error
}

func UpdateCategoryRecommendValue(id string, recommendValue int) error {
	return DB.Model(&Category{}).Where("id = ?", id).Update("IsRecommend", recommendValue).Error
}
