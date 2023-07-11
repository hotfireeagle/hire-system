package model

import (
	"time"

	"gorm.io/gorm"
)

type Job struct {
	Id              string         `gorm:"column:id;primaryKey" json:"id"`
	CreateTime      time.Time      `gorm:"column:create_time;autoCreateTime" json:"createTime"`
	UpdateTime      time.Time      `gorm:"column:update_time;autoUpdateTime" json:"updateTime"`
	DeleteTime      gorm.DeletedAt `gorm:"column:delete_time;index" json:"deleteTime"`
	Name            string         `gorm:"column:name;not null" json:"name"`
	MinSalary       float64        `gorm:"column:min_salary;not null" json:"minSalary"`              // 最低薪资
	MaxSalary       float64        `gorm:"column:max_salary;not null" json:"maxSalary"`              // 最高薪资
	PayMonth        int            `gorm:"column:pay_month;not null" json:"payMonth"`                // 十几薪
	JobTags         []JobTag       `gorm:"many2many:jobs_to_tags" json:"jobTags"`                    // 标签
	PositionCode    string         `gorm:"column:position_code;not null" json:"positionCode"`        // 上班地
	MinYearRequired uint           `gorm:"column:min_year_required;not null" json:"minYearRequired"` // 最小工作年限要求
	MaxYearRequired uint           `gorm:"column:max_year_required;not null" json:"maxYearRequired"` // 最大工作年限要求
	Education       uint           `gorm:"column:education;not null" json:"education"`
}
