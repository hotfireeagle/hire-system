package model

type Permission struct {
	Id       uint   `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	Name     string `gorm:"column:name;not null" json:"name"`         // permission name
	ParentId uint   `gorm:"column:parent_id;" json:"parentId"`        // parent permission id, just for frontend show the permission tree
	Endpoint string `gorm:"column:endpoint;not null" json:"endpoint"` // api path
	Method   string `gorm:"column:method;not null" json:"method"`     // get、post、patch、delete...
}

func (p Permission) TableName() string {
	return "permission"
}

func FindPermissionByPermissionName(name string) (*Permission, error) {
	var p Permission
	err := DB.Where("name = ?", name).First(&p).Error
	return &p, err
}

func NewPermission(name string, parentPermissionName string, api string, httpMethod string) {
	permissionObj := Permission{
		Name:     name,
		Endpoint: api,
		Method:   httpMethod,
	}

	if parentPermissionName != "" {
		parentPermissionObj, err := FindPermissionByPermissionName(parentPermissionName)
		if err != nil {
			permissionObj.ParentId = parentPermissionObj.Id
		}
	}

	DB.Create(permissionObj)
}
