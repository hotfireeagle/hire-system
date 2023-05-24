import { Card } from "antd"
import { LoginForm, ProFormText } from "@ant-design/pro-components"
import { UserOutlined, LockOutlined, } from "@ant-design/icons"
import request from "@/utils/request"
import { saveToken } from "@/utils/localStorage"
import { history } from "@umijs/max"

const LoginPage = () => {
  /**
   * 进行登录处理的方法
   * @returns 
   */
  const loginHandler = values => {
    const postData = { ...values }
    return request("/user/login", postData, "post").then(token => {
      // TODO: 这个接口还得返回权限列表数据
      saveToken(token)
      setTimeout(() => {
        history.push("/")
      }, 300)
    })
  }

  return (
    <Card>
      <LoginForm
        onFinish={loginHandler}
        logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
        title="xxx fake platform"
        subTitle="xxx system which just an demo"
      >
        <ProFormText
          name="email"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined className={"prefixIcon"} />,
          }}
          placeholder="请输入账号"
          rules={[
            {
              required: true,
              message: "请输入账号!",
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined className={"prefixIcon"} />,
          }}
          placeholder="请输入密码"
          rules={[
            {
              required: true,
              message: "请输入密码!",
            },
          ]}
        />
      </LoginForm>
    </Card>
  )
}

export default LoginPage