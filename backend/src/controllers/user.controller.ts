import { NextFunction, Request, Response } from 'express';
import md5 from 'md5';
// import dayjs from 'dayjs';
import nodeSendEmail from 'node-send-email'
import { User, UserListReq, UserReq } from '../interfaces/user.interface';
import UserService from '../services/user.service';
import { 
  TokenExpired, 
} from '../utils/util'
import { ResponseMap, HttpCodeSuccess } from '../utils/const'
// import { getCodeHtml, registerEmailInfo } from '../utils/registerEmail';

const { 
  // UserExist, 
  Success, 
  SystemError, 
  UserError, 
  // ParamsError, 
  // EmailError,
  LoginError,
  // AuthCodeError 
} = ResponseMap

const { sendEmail } = nodeSendEmail as any
class UsersController {
  public UserService = new UserService();
  
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, password, namespace } = req.body as any;
      console.log("登录信息：", user);
      const findData: User | null = await this.UserService.findUserByUsername({user, namespace});
      if (!findData || findData.password !== md5(password)) {
        res.status(HttpCodeSuccess).json({ ...UserError });
        return;
      }
      // 密码校验，并写入token
      const { jwtToken } = await this.UserService.login({
        id: findData.id, user, namespace
      })
      if (!jwtToken) {
        res.status(HttpCodeSuccess).json({ ...LoginError });
        return;
      }
      res.status(HttpCodeSuccess).json({ 
        ...Success,
        data: {
          jwt_token: jwtToken,
          user
        } 
      });
      return
    } catch (error) {
      next(error);
    }
  };

  // public register = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { username, password, email, phone, job, authCode }: any = req.body;

  //     console.log('注册用户信息：');
  //     console.log(username);
  //     // 参数校验
  //     if (!username || !password || !email || !authCode) {
  //       res.status(HttpCodeSuccess).json(ParamsError);
  //       return;
  //     }
  //     // 检查邮箱验证码是否正确
  //     const checkAuthCode: any = await this.UserService.checkAuthCode(email, authCode)
  //     if(!checkAuthCode){
  //       res.status(HttpCodeSuccess).json(AuthCodeError);
  //       return
  //     }
  //     // 用户是否已存在
  //     const usernameExists: any = await this.UserService.checkUsernameExists("namespace", username);
  //     if(usernameExists){
  //       res.status(HttpCodeSuccess).json(UserExist);
  //       return
  //     }
  //     // 邮箱是否已存在
  //     const emailExists: any = await this.UserService.checkEmailExists(email);
  //     if(emailExists){
  //       res.status(HttpCodeSuccess).json(EmailError);
  //       return
  //     }
      
  //     const params: any = {
  //       username,
  //       password: md5(password),
  //       job,
  //       phone,
  //       email,
  //       status: UserStatus.Init
  //     }
      
  //     try {
  //       await this.UserService.createUser(params);
  //     }catch(err:any){
  //       res.status(HttpCodeSuccess).json({ ...SystemError, message: err.message });
  //       return
  //     }
  //     res.status(HttpCodeSuccess).json({ ...Success, data: null });
  //   } catch (error) {
  //     console.log(error)
  //     next(error);
  //   }
  // };

  public getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers['userId'] as string;
      const { userInfo, roleList }: any = await this.UserService.findUserAndRoleById({id: Number(userId)});
      const { id, namespace, user, name, job, phone_number, email } = userInfo
      res.status(HttpCodeSuccess).json({ 
        ...Success, 
        data: {
          id, namespace, user, name, job, phone_number, email, roleList
        }
      });
      return;
    } catch (error) {
      next(error);
    }
  };

  // public getEmailCode = async ({ Email, CodeType } : {Email: string, CodeType: number}) => {
  //   console.log("Email", Email, CodeType)
  //   try {
  //     // 校验一下Email的格式
  //     const EmailCode = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0')
  //     const params:any = {
  //       ...registerEmailInfo,
  //       to: Email,
  //       html: getCodeHtml(EmailCode)
  //     }
  //     console.log("params", params)
  //     // 增加安全验证，在发送之前要确认下当前邮箱的验证码是否过期
  //     // 如果没有过期不允许重复发送，15分钟
  //     const sendResult = await sendEmail(params, (result:any) => {
  //       return result
  //     })
  //     console.log("sendResult", sendResult)
  //     if(!sendResult){
  //       // 插入数据到数据库，注册code码，保存邮箱、code、时间、是否已失效、type(注册、修改密码)
  //       const expiredAt = dayjs().add(15, 'minutes').unix()
  //       const data:any = {
  //         code: EmailCode,
  //         email: Email,
  //         expiredAt,
  //         type: CodeType
  //       }
  //       await this.UserService.createAuthCode(data)
  //       return true
  //     }else{
  //       return false;
  //     }   
  //   }catch(err){
  //     return false
  //   }
  // }

  // public sendEmailCode = async (req: Request, res: Response) => {
  //   const { email, codeType } = req.body;
  //   const result = await this.getEmailCode({ Email: email, CodeType: codeType })
  //   if(result){
  //     res.status(HttpCodeSuccess).json({...Success, data: null});
  //     return
  //   }
  //   res.status(HttpCodeSuccess).json(SystemError);
  // }

  // 重置密码
  // 1、用户输入邮箱（验证邮箱code），发送重置密
  // 邮箱、密码
  // public changePassword = async (req: Request, res: Response) => {
  //   const { id, email, authCode, password } = req.body;
  //   // 检查邮箱验证码是否正确
  //   const checkAuthCode: any = await this.UserService.checkAuthCode(email, authCode)
  //   if(!checkAuthCode){
  //     res.status(HttpCodeSuccess).json(AuthCodeError);
  //     return
  //   }
  //   const data:any = {
  //     password: md5(password)
  //   }
  //   const result = await this.UserService.updateUser(data, id)
  //   // 更新用户密码
  //   if(result){
  //     res.status(HttpCodeSuccess).json({...Success, data: null});
  //     return
  //   }
  //   res.status(HttpCodeSuccess).json(SystemError);
  // }

  // 更新用户
  public updateUser = async (req: Request, res: Response) => {
    const { id, username, email, phone, status, job } = req.body;
    try{
      const jobList = await this.UserService.updateUser({
        username, email, phone, status, job
      }, id)
      res.status(HttpCodeSuccess).json({...Success, data: jobList});
    }catch(err:any){
      res.status(HttpCodeSuccess).json({...SystemError, message: err.message});
    }
  }

  // getUserList
  public getUserList = async (req: Request, res: Response) => {
    const { id, user }:UserListReq = req.query;
    const query:UserListReq = {}
    if(id){
      query.id = Number(id);
    }
    if(user){
      query.user = user;
    }
    try{
      const result = await this.UserService.getUserList(query)
      res.status(HttpCodeSuccess).json({...Success, ...result});
    }catch(err:any){
      res.status(HttpCodeSuccess).json({...SystemError, message: err.message});
    }
  }
 
  // createInnerUser
  public createInnerUser = async (req: Request, res: Response) => {
    const { namespace, user, name, job, password, email, phone_number, role_ids }: UserReq = req.body;
    const remoteUser = req.headers['remoteUser'] as string
    // TODO: 统一检验namespace是否存在于库里
    if(!namespace){
      res.status(HttpCodeSuccess).json({...SystemError, message: 'Namespace is required!'});
      return
    }
    // 1、检查新增用户是否已存在
    try{
      const checkUser = await this.UserService.checkUsernameExists(namespace, user)
      if(checkUser){
        res.status(HttpCodeSuccess).json({...SystemError, message: 'User already exist!'});
        return
      }
      // 2、判断新增用户是否选择角色，如果选择角色
      const result = await this.UserService.createInnerUser({
        namespace, user, name, job, password, email, phone_number, role_ids, operator: remoteUser
      })
      res.status(HttpCodeSuccess).json({...Success, data: result});
    }catch(err:any){
      res.status(HttpCodeSuccess).json({...SystemError, message: err.message});
    }
  }

  public updateInnerUser = async (req: Request, res: Response) => {
    const { namespace, id=0, name, job, password, email, phone_number, role_ids }: UserReq = req.body;
    const operator = req.headers['remoteUser'] as string
    // TODO:校验参数,邮件、手机号
    if(!namespace || id === 0){
      res.status(HttpCodeSuccess).json({...SystemError, message: 'Namespace and id is required!'});
      return
    }
    // 查询当前用户信息
    const userInfo:any = await this.UserService.findUserById({ id })
    if(!userInfo){
      res.status(HttpCodeSuccess).json({...SystemError, message: 'User not found!'});
      return
    }
    if(userInfo.namespace !== namespace){
      res.status(HttpCodeSuccess).json({...SystemError, message: 'Namespace is not match!'});
      return
    }
    const updateInfo:any = {
      namespace, id, user: userInfo.user, operator
    }
    if(name){
      updateInfo.name = name
    }
    if(job){
      updateInfo.job = job
    }
    if(password){
      updateInfo.password = md5(password)
    }
    if(email){
      updateInfo.email = email
    }
    if(phone_number){
      updateInfo.phone_number = phone_number
    }
    if(Array.isArray(role_ids) && role_ids.length > 0){
      updateInfo.role_ids = role_ids
    }
    try{
      const result = await this.UserService.updateInnerUser(updateInfo)
      res.status(HttpCodeSuccess).json({...Success, data: result});
    }catch(err:any){
      res.status(HttpCodeSuccess).json({...SystemError, message: err.message});
    }
  }
  // deleteUser
  public deleteUser = async (req: Request, res: Response) => {
    const { namespace, id, user } = req.body;
    try{
      const result = await this.UserService.deleteUser({namespace, id, user})
      if(result){
        res.status(HttpCodeSuccess).json({...Success, data: result});
      }else{
        res.status(HttpCodeSuccess).json({...SystemError, message: 'please check your params'});
      }
    }catch(err:any){
      res.status(HttpCodeSuccess).json({...SystemError, message: err.message});
    }
  }
}

export default UsersController;
