## API服务

### 1、登陆注册

### 2、部署

废弃：推送Docker到Docker hub，然后通过CI拉取镜像，重启镜像

进入机器，重新build，然后restart

md5 需要增加复杂度
参数必选和类型、规则校验

- [x] 需要鉴权的接口，过一下鉴权
- Permission相关的接口调试通过

- 接口参数统一小写、下划线格式返回
- 登录完成后，请求头传递参数jwt_token，作为登录凭证
- 如何将service中的错误返回给controller，不要返回成功
- 参数校验和报错信息不准确，如果一次调用成功后，会失败，可更换多个参数重试，因为对多个参数进行了唯一值的限制
- 个别create_time和update_time 初始值为0
- 数据已存在检验和重复插入数据
- 返回列表排序

没有生效
```
hooks: {
    beforeCreate: (user) => {
        const now = dayjs().unix()
        user.create_time = now
        user.update_time = now
    }
}
```

- 管理员账号不允许删除
- 删除多余的用户
- 一键部署

## 12月12日待更新
- API的权限控制
- API的权限初始化
- Readme.md更新
- 构建不同环境的Docker镜像
