export const ResponseMap = {
    Success: {
        ret_code: 0,
        message: '成功'
    },
    UserExist: {
        ret_code: 10000,
        message: '用户名已存在'
    },
    SystemError: {
        ret_code: 10001,
        message: '系统异常'
    },
    UserError: {
        ret_code: 10002,
        message: '用户名或密码错误'
    },
    ParamsError: {
        ret_code: 10003,
        message: '参数错误'
    },
    EmailError: {
        ret_code: 10004,
        message: '邮箱已被使用'
    },
    LoginError: {
        ret_code: 10005,
        message: '用户未登录'
    },
    AuthCodeError: {
        ret_code: 10006,
        message: '验证码错误'
    },
    CategoryExisted: {
        ret_code: 10008,
        message: '该问题类型已存在'
    },
    TokenExpired: {
        ret_code: 10009,
        message: '登录凭证已过期'
    },
    SystemEmptyError: {
        ret_code: 10010,
        message: '未查询到数据'
    },
}

export const [HttpCodeSuccess, HttpCodeNotFound] = [200, 400]

export const SimulateTypeMap = {
    Special: 1,
    Custom: 2
}

export const QuestionResourceMap = {
    Public: 'Public',
    Private: 'Private'
}