import { SettingDrawer } from "@ant-design/pro-components"
import defaultSettings from "../config/defaultSettings"
import { fetchUserInfo } from "@/utils/tool"
import { history } from "@umijs/max"

const loginPath = "/user/login"

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState() {
  const userDetail = await fetchUserInfo()
  return {
    settings: defaultSettings,
    userDetail,
  }
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout = ({ initialState, setInitialState }) => {
  return {
    actionsRender: () => [],
    avatarProps: {
      style: {
        backgroundColor: "#f56a00",
      },
      children: initialState?.userDetail?.email?.[0]?.toUpperCase(),
      onClick: () => history.replace(loginPath),
    },
    footerRender: () => null,
    onPageChange: () => {},
    layoutBgImgList: [
      {
        src: "https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr",
        left: 85,
        bottom: 100,
        height: "303px",
      },
      {
        src: "https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr",
        bottom: -68,
        right: -45,
        height: "303px",
      },
      {
        src: "https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr",
        bottom: 0,
        left: 0,
        width: "331px",
      },
    ],
    links: [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }))
            }}
          />
        </>
      )
    },
    ...initialState?.settings,
  }
}
