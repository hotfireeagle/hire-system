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
	return categoryList, DB.Find(&categoryList).Error // gorm会自动加
}

func UpdateCategoryRecommendValue(id string, recommendValue int) error {
	return DB.Model(&Category{}).Where("id = ?", id).Update("IsRecommend", recommendValue).Error
}

func SelectRecommendCategoryList() (categoryList []Category, err error) {
	return categoryList, DB.Where("delete_time is null and is_recommend = ?", IsRecommendVal).Find(&categoryList).Error
}

// 找出一个节点的所有子节点，递归找即可
func FindChildrenNodes(parentId string) []string {
	childrenIds := make([]string, 0)

	var find func(id string)
	find = func(id string) {
		var ids []string
		childrenIds = append(childrenIds, id)
		DB.Model(&Category{}).Where("parent_id = ?", id).Pluck("id", &ids)

		for _, id := range ids {
			find(id)
		}
	}

	find(parentId)

	return childrenIds
}

func DeleteCategoryIdBatchOperation(ids []string) error {
	return DB.Delete(&Category{}, ids).Error
}
