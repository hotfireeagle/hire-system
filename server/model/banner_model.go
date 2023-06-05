package model

import (
	"time"

	"gorm.io/gorm"
)

type Banner struct {
	Id          uint           `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	CreateTime  time.Time      `gorm:"column:create_time;autoCreateTime" json:"createTime"`
	UpdateTime  time.Time      `gorm:"column:update_time;autoUpdateTime" json:"updateTime"`
	DeleteTime  gorm.DeletedAt `gorm:"column:delete_time;index" json:"deleteTime"`
	Url         string         `gorm:"column:url;not null" json:"url" binding:"required"`
	JumpUrl     string         `gorm:"column:jump_url" json:"jumpUrl" binding:"required"`
	OnlineTime  time.Time      `gorm:"column:online_time;not null" json:"onlineTime" binding:"required"`
	OfflineTime time.Time      `gorm:"column:offline_time;not null" json:"offlineTime" binding:"required"`
}

type QueryBannerListRequestBody struct {
	Current  int `json:"currnt"`
	PageSize int `json:"pageSize"`
}

type QueryBannerListResponse struct {
	Total int64    `json:"total"`
	List  []Banner `json:"list"`
}

func InsertBanner(bannerObj *Banner) error {
	return DB.Create(bannerObj).Error
}

func UpdateBanner(bannerObj *Banner) error {
	return DB.Model(&Banner{}).Select("Url", "JumpUrl", "OnlineTime", "OfflineTime").Updates(bannerObj).Error
}

func DeleteBanner(id string) error {
	return DB.Model(&Banner{}).Where("id = ?", id).Update("DeleteTime", time.Now()).Error
}

func QueryBannerList(queryData *QueryBannerListRequestBody) (QueryBannerListResponse, error) {
	var total int64

	tx := DB.Model(&Banner{}).Where("delete_time is null")
	tx.Count(&total)

	if queryData.Current == 0 {
		queryData.Current = 1
	}
	if queryData.PageSize == 0 {
		queryData.PageSize = 10
	}

	var bannerList []Banner
	var res QueryBannerListResponse
	offset := (queryData.Current - 1) * queryData.PageSize
	err := tx.Limit(queryData.PageSize).Offset(offset).Find(&bannerList).Error
	if err != nil {
		return res, err
	}

	res = QueryBannerListResponse{
		Total: total,
		List:  bannerList,
	}

	return res, nil
}
