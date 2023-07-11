package model

import (
	"time"

	"gorm.io/gorm"
)

type Company struct {
	Id         string         `gorm:"column:id;primaryKey" json:"id"`
	CreateTime time.Time      `gorm:"column:create_time;autoCreateTime" json:"createTime"`
	UpdateTime time.Time      `gorm:"column:update_time;autoUpdateTime" json:"updateTime"`
	DeleteTime gorm.DeletedAt `gorm:"column:delete_time;index" json:"deleteTime"`
	// 公司名
	Name string `gorm:"column:name;not null;unique" json:"name"`
	// 公司富文本描述
	Desc string `gorm:"column:desc;not null" json:"desc"`
	// 融资阶段
	LongZiCode uint `gorm:"column:long_zi_code;not null;comment:'1:未融资;2:天使轮;3:A轮;4:B轮;5:C轮;6:D轮及以上;7:已上市;8:不需要融资'" json:"longZiCode"`
	// 公司所在地
	CompanyLocationCode string `gorm:"column:company_location_code;not null" json:"companyLocationCode"`
	// 公司所属行业类型
	BusinessType BusinessType `json:"businessType"`
	// 公司规模
	EmployerCount uint `gorm:"column:employer_count;not null;comment:'1:0-20人;2:20-99人;3:100-499人;4:500-999人;5:1000-9999人;6:10000人以上'" json:"employerCount"`
}
