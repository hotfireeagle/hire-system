package model

import (
	"time"

	"gorm.io/gorm"
)

// 角色表
type Role struct {
	Id          uint           `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	CreateTime  time.Time      `gorm:"column:create_time;autoCreateTime" json:"createTime"`
	UpdateTime  time.Time      `gorm:"column:update_time;autoUpdateTime" json:"updateTime,omitempty"`
	DeleteTime  gorm.DeletedAt `gorm:"column:delete_time;index" json:"deleteTime,omitempty"`
	Name        string         `gorm:"column:name;unique;not null" binding:"required" json:"name"`
	Desc        string         `gorm:"column:desc" binding:"required" json:"desc"`
	CreatorId   uint           `gorm:"column:creator_id;not null" binding:"required" json:"creatorId"`
	OpeUsers    []OpeUser      `gorm:"many2many:opeusers_to_roles"`
	Permissions []Permission   `gorm:"many2many:permissions_to_roles"`
}

type NewRoleRequestBody struct {
	Name        string `json:"name" binding:"required"`
	Desc        string `json:"desc" binding:"required"`
	Permissions []uint `json:"permissions" binding:"required"`
}

type QueryRoleListReqeustBody struct {
	Name     string `json:"name"`
	Current  int    `json:"currnt"`
	PageSize int    `json:"pageSize"`
}

type QueryRoleListResponseBody struct {
	List  []Role `json:"list"`
	Total int64  `json:"total"`
}

// 查询角色列表数据
func SelectRoleList(queryData *QueryRoleListReqeustBody) (QueryRoleListResponseBody, error) {
	var roleList []Role
	var total int64
	var res QueryRoleListResponseBody
	tx := DB.Model(&Role{})

	if queryData.Name != "" {
		tx = tx.Where("name = ?", queryData.Name)
	}
	tx.Count(&total)

	if queryData.Current == 0 {
		queryData.Current = 1
	}
	if queryData.PageSize == 0 {
		queryData.PageSize = 10
	}

	offset := (queryData.Current - 1) * queryData.PageSize
	tx = tx.Limit(queryData.PageSize).Offset(offset)

	err := tx.Find(&roleList).Error
	res = QueryRoleListResponseBody{
		List:  roleList,
		Total: total,
	}
	return res, err
}

// 新增一个角色
func NewRole(data *NewRoleRequestBody) error {
	permissions, err := FindPermissionListByIdList(data.Permissions)
	if err != nil {
		return err
	}

	roleObj := &Role{
		Name:        data.Name,
		Desc:        data.Desc,
		Permissions: permissions,
	}

	for _, perm := range permissions {
		_, err = casbinEnforcer.AddPolicy(data.Name, perm.Endpoint, perm.Method)
	}
	err = DB.Create(roleObj).Error

	// TODO: 事务

	return err
}
