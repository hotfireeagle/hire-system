package model

import (
	"time"

	"gorm.io/gorm"
)

type Company struct {
	Id string `gorm:"column:id;primaryKey" json:"id"`

	CreateTime time.Time `gorm:"column:create_time;autoCreateTime" json:"createTime"`

	UpdateTime time.Time `gorm:"column:update_time;autoUpdateTime" json:"updateTime"`

	DeleteTime gorm.DeletedAt `gorm:"column:delete_time;index" json:"deleteTime"`

	// 公司名
	Name string `gorm:"column:name;not null;unique" json:"name" binding:"required"`

	// 融资阶段
	LongZiCode uint `gorm:"column:long_zi_code;not null;comment:'1:未融资;2:天使轮;3:A轮;4:B轮;5:C轮;6:D轮及以上;7:已上市;8:不需要融资'" json:"longZiCode" binding:"required"`

	// 公司地点
	CompanyLocationCode string `gorm:"column:company_location_code;not null" json:"companyLocationCode" binding:"required"`

	// 公司行业类型
	BusinessType uint `json:"businessType" binding:"required"`

	// 公司规模
	EmployerCount uint `gorm:"column:employer_count;not null;comment:'1:0-20人;2:20-99人;3:100-499人;4:500-999人;5:1000-9999人;6:10000人以上'" json:"employerCount" binding:"required"`

	// 公司logo
	CompanyLogo string `gorm:"column:company_logo;not null" json:"companyLogo" binding:"required"`

	// 公司简介(富文本)
	CompanyDesc string `gorm:"column:company_desc;not null" json:"companyDesc" binding:"required"`

	// 管理员账号
	AdminAccount string `gorm:"column:admin_account;not null" json:"-" binding:"required"`
}

// 用户在前台网页入驻成为boss端的时候所填写的资料
// 创建这个boss端所填写的手机号就是管理员账号
func NewCompany(companyObj *Company) error {
	return DB.Create(companyObj).Error
}

// 更新公司信息的时候触发
func ModifyCompany(compantObj *Company) error {
	return DB.Model(compantObj).Select(
		"LongZiCode",
		"CompanyLocationCode",
		"BusinessType",
		"EmployerCount",
		"CompanyLogo",
		"CompanyDesc",
	).Updates(compantObj).Where("id = ?", compantObj.Id).Error
}
