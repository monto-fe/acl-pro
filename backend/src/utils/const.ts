export const ResponseMap = {
    Success: {
        ret_code: 0,
        message: 'success'
    },
    UserExist: {
        ret_code: 10000,
        message: 'username already exist'
    },
    SystemError: {
        ret_code: 10001,
        message: 'system error'
    },
    UserError: {
        ret_code: 10002,
        message: 'username or password error'
    },
    ParamsError: {
        ret_code: 10003,
        message: 'params error'
    },
    EmailError: {
        ret_code: 10004,
        message: 'email already exist'
    },
    LoginError: {
        ret_code: 10005,
        message: 'user not login'
    },
    AuthCodeError: {
        ret_code: 10006,
        message: 'Incorrect verification code.'
    },
    TokenExpired: {
        ret_code: 10009,
        message: '登录凭证已过期'
    },
    SystemEmptyError: {
        ret_code: 10010,
        message: '未查询到数据'
    },
    RoleExisted: {
        ret_code: 10011,
        message: '角色Role或Name不能在相同的namespace下重复'
    }
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

export const ResourceCategory = ["API", "Menu", "Action", "Other"];