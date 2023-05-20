package model

type Permissions2Roles struct {
	Id           uint `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	PermissionId uint `gorm:"column:permission_id;not null" json:"permissionId"`
	RoleId       uint `gorm:"column:role_id;not null" json:"roleId"`
}

func (p2r Permissions2Roles) TableName() string {
	return "permissions_to_roles"
}
