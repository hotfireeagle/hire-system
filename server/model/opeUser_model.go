package model

import (
	"hire/util"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// 后台用户表
type OpeUser struct {
	Id         uint           `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	CreateTime time.Time      `gorm:"column:create_time;autoCreateTime" json:"createTime"`
	UpdateTime time.Time      `gorm:"column:update_time;autoUpdateTime" json:"updateTime,omitempty"`
	DeleteTime gorm.DeletedAt `gorm:"column:delete_time;index" json:"deleteTime,omitempty"`
	Email      string         `gorm:"column:email;unique;not null" binding:"required" json:"email,omitempty"`
	Password   string         `gorm:"column:password;not null" binding:"required" json:"password,omitempty"`
	Roles      []Role         `gorm:"many2many:opeusers_to_roles"`
}

type QueryOpeUserListRequestBody struct {
	Current  int    `json:"current"`
	PageSize int    `json:"pageSize"`
	Email    string `json:"email"`
}

type QueryOpeUserListResponse struct {
	List  []OpeUser `json:"list"`
	Total int64     `json:"total"`
}

type NewOpeUserRequestBody struct {
	Id    uint   `json:"id"`
	Email string `json:"email" binding:"required"`
	Roles []uint `json:"roles" binding:"required"`
}

func (o OpeUser) CheckIsRoot() bool {
	return o.Email == "root"
}

// 创建一个后台用户
func NewOpeUser(opeUserObj *OpeUser) error {
	err := DB.Create(&opeUserObj).Error
	return err
}

// 根据邮箱查找出后台用户
func FindOpeUserByEmail(email string) (user *OpeUser, err error) {
	return user, DB.Where("email = ?", email).First(&user).Error
}

// 通过Limit(1)+Find形式查找用户
func FindOpeUserByEmailButNoNotFoundError(email string) (user OpeUser, err error) {
	return user, DB.Where("email = ?", email).Limit(1).Find(&user).Error
}

func SelectOpeUserList(queryData *QueryOpeUserListRequestBody) (QueryOpeUserListResponse, error) {
	var (
		total       int64
		opeUserList []OpeUser
		err         error
	)

	if queryData.Current == 0 {
		queryData.Current = 1
	}
	if queryData.PageSize == 0 {
		queryData.PageSize = 10
	}

	// 过滤掉root用户
	db := DB.Model(&OpeUser{}).Not("email = ?", "root").Select("Id", "Email", "CreateTime")

	if queryData.Email != "" {
		db = db.Where("email = ?", queryData.Email)
	}

	db.Count(&total)

	offset := (queryData.Current - 1) * queryData.PageSize
	db = db.Limit(queryData.PageSize).Offset(offset)
	err = db.Find(&opeUserList).Error

	res := QueryOpeUserListResponse{
		List:  opeUserList,
		Total: total,
	}

	return res, err
}

func InsertOpeUser(data *NewOpeUserRequestBody) (string, error) {
	roles, err := SelectRolesByIds(data.Roles)
	if err != nil {
		return "", err
	}

	randomPassword := util.GeneratePassword()
	resultByte, err := bcrypt.GenerateFromPassword([]byte(randomPassword), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	userObj := OpeUser{
		Email:    data.Email,
		Password: string(resultByte),
		Roles:    roles,
	}

	for _, roleObj := range roles {
		casbinEnforcer.AddGroupingPolicy(data.Email, roleObj.Name)
	}

	err = DB.Create(&userObj).Error

	return randomPassword, err
}

func UpdateOpeUser(data *NewOpeUserRequestBody) error {
	// 先把老的casbin权限规则给删除
	casbinEnforcer.RemoveFilteredGroupingPolicy(0, data.Email)

	// 查找出新的所关联上的角色
	newRoles, err := SelectRolesByIds(data.Roles)
	if err != nil {
		return err
	}

	// 关联新的casbin权限规则
	for _, roleObj := range newRoles {
		casbinEnforcer.AddGroupingPolicy(data.Email, roleObj.Name)
	}

	err = DB.Model(&OpeUser{Id: data.Id}).Association("Roles").Replace(newRoles)
	return err
}

func FindOpeUserDetailById(id any) (user OpeUser, err error) {
	return user, DB.Preload("Roles").Find(&user, id).Error
}

func OpeUser2UI(user *OpeUser) *NewOpeUserRequestBody {
	answer := &NewOpeUserRequestBody{
		Id:    user.Id,
		Email: user.Email,
		Roles: util.MapSlice(user.Roles, func(r Role) uint {
			return r.Id
		}),
	}
	return answer
}
