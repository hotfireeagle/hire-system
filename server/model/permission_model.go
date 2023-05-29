package model

type Permission struct {
	Id       uint   `gorm:"column:id;primaryKey;autoIncrement;not null" json:"id"`
	Name     string `gorm:"column:name;unique;not null" json:"name"`  // permission name
	ParentId uint   `gorm:"column:parent_id;" json:"parentId"`        // parent permission id, just for frontend show the permission tree
	Endpoint string `gorm:"column:endpoint;not null" json:"endpoint"` // api path
	Method   string `gorm:"column:method;not null" json:"method"`     // get、post、patch、delete...
	Roles    []Role `gorm:"many2many:permissions_to_roles"`
}

// 查看权限树时的请求参数
type QueryPermissionListRequestParam struct {
	Name string `json:"name"`
}

// 查看权限树的返回数据
type QueryPermissionTreeResponseData struct {
	Id       uint                                `json:"id"`
	Name     string                              `json:"name"`
	ParentId uint                                `json:"parentId"`
	Children *[]*QueryPermissionTreeResponseData `json:"children"`
}

func FindPermissionByPermissionName(name string) (*Permission, error) {
	var p Permission
	err := DB.Where("name = ?", name).First(&p).Error
	return &p, err
}

// 新建一个权限, parentPermissionName非必传, 不传的话即表示不存在上级权限
func newPermission(name string, parentPermissionName string, api string, httpMethod string) {
	dbPermission := new(Permission)
	err := DB.Where("name = ?", name).Find(dbPermission).Limit(1).Error
	if err != nil {
		panic(err)
	}

	permissionObj := Permission{
		Name:     name,
		Endpoint: api,
		Method:   httpMethod,
	}
	if parentPermissionName != "" {
		parentPermissionObj, err := FindPermissionByPermissionName(parentPermissionName)
		if err != nil {
			panic(err)
		}
		permissionObj.ParentId = parentPermissionObj.Id
	}

	if dbPermission.Id != 0 {
		// 做update的操作
		temp := make(map[string]interface{})
		temp["name"] = permissionObj.Name
		temp["parent_id"] = permissionObj.ParentId
		temp["endpoint"] = permissionObj.Endpoint
		temp["method"] = permissionObj.Method
		DB.Model(dbPermission).Updates(temp)
	} else {
		// 做创建的操作
		DB.Create(&permissionObj)
	}
}

// 查询出所有的权限列表数据
func SelectPermissionList(queryData *QueryPermissionListRequestParam) (*[]Permission, error) {
	var permissionList []Permission

	tx := DB.Model(&Permission{}).Select("id", "name", "parent_id")

	if queryData.Name != "" {
		tx = tx.Where("name = ?", queryData.Name)
	}

	return &permissionList, tx.Find(&permissionList).Error
}

func FindPermissionById(id uint) (p Permission, err error) {
	return p, DB.Find(&p).Where("id = ?", id).Error
}

func FindPermissionListByIdList(ids []uint) (permList []Permission, err error) {
	return permList, DB.Find(&permList, ids).Error
}

func ValidatePermission(account string, endpoint string, method string) (bool, error) {
	casbinEnforcer.LoadPolicy()
	ok, err := casbinEnforcer.Enforce(account, endpoint, method)

	if err != nil {
		return false, err
	}

	return ok, nil
}
