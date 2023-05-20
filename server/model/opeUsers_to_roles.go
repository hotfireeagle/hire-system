package model

type Opeusers2Roles struct {
	Id     uint `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	UserId uint `gorm:"column:user_id" json:"userId"`
	RoleId uint `gorm:"column:role_id" json:"roleId"`
}

func (u Opeusers2Roles) TableName() string {
	return "users_to_roles"
}
