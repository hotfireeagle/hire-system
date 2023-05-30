package model

import (
	"time"

	"gorm.io/gorm"
)

// 角色表
type Role struct {
	Id          uint           `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	CreateTime  time.Time      `gorm:"column:create_time;autoCreateTime" json:"createTime"`
	UpdateTime  time.Time      `gorm:"column:update_time;autoUpdateTime" json:"updateTime"`
	DeleteTime  gorm.DeletedAt `gorm:"column:delete_time;index" json:"deleteTime"`
	Name        string         `gorm:"column:name;unique;not null" binding:"required" json:"name"`
	Desc        string         `gorm:"column:desc" binding:"required" json:"desc,omitempty"`
	CreatorId   uint           `gorm:"column:creator_id;not null" binding:"required" json:"creatorId,omitempty"`
	OpeUsers    []OpeUser      `gorm:"many2many:opeusers_to_roles" json:"opeUsers"`
	Permissions []Permission   `gorm:"many2many:permissions_to_roles" json:"permissions"`
}

type RoleUIMeta struct {
	Id          uint   `json:"id"`
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
func NewRole(data *RoleUIMeta) error {
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
	if err != nil {
		casbinEnforcer.RemoveFilteredPolicy(0, data.Name)
		return err
	}
	err = DB.Create(roleObj).Error
	if err != nil {
		casbinEnforcer.RemoveFilteredPolicy(0, data.Name)
		return err
	}

	return nil
}

func SelectRoleDetail(roleId string) (roleDetail Role, err error) {
	return roleDetail, DB.Preload("Permissions").Find(&roleDetail, roleId).Error
}

func UpdateRole(data *RoleUIMeta) error {
	roleObj := Role{
		Id: data.Id,
	}
	dbRole, err := SelectRoleById(data.Id)
	if err != nil {
		return err
	}

	var finalErr error
	permList, finalErr := FindPermissionListByIdList(data.Permissions)
	if finalErr != nil {
		return finalErr
	}

	casbinEnforcer.RemoveFilteredPolicy(0, dbRole.Name)
	for _, perm := range permList {
		_, finalErr = casbinEnforcer.AddPolicy(data.Name, perm.Endpoint, perm.Method)
	}

	// 手动处理casbin的回退事务
	defer func() {
		if finalErr != nil {
			casbinEnforcer.RemoveFilteredPolicy(0, data.Name)
		}
	}()

	DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&roleObj).Select("Name", "Desc").Updates(Role{
			Name: data.Name,
			Desc: data.Desc,
		}).Error; err != nil {
			finalErr = err
			return err
		}

		if err := tx.Model(&roleObj).Association("Permissions").Replace(permList); err != nil {
			finalErr = err
			return err
		}

		return nil
	})

	return finalErr
}

func SelectRoleById(roleId uint) (role Role, err error) {
	return role, DB.Find(&role, roleId).Error
}

func SelectAllRoles() (roles []Role, err error) {
	return roles, DB.Select("Id", "Name").Find(&roles).Error
}

func SelectRolesByIds(ids []uint) (roles []Role, err error) {
	return roles, DB.Find(&roles, ids).Error
}
