import { NextFunction, Request, Response } from 'express';
import md5 from 'md5';
// import dayjs from 'dayjs';
import nodeSendEmail from 'node-send-email'
import { User, UserListReq, UserReq } from '../interfaces/user.interface';
import UserService from '../services/user.service';
import RoleService from '../services/role.service';
import { 
  TokenExpired, 
} from '../utils/util'
import { ResponseMap, HttpCodeSuccess } from '../utils/const'
import { pageCompute } from '../utils/pageCompute';
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
  public RoleService = new RoleService();
  
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
    const { id, user, userName, roleName, current, pageSize } = req.query as any;
    const query:UserListReq = {
      ...pageCompute(current, pageSize)
    }
    if(id){
      query.id = Number(id);
    }
    if(user){
      query.user = [user];
    }
    try{
      // 如果roleName存在，则查询user，number[]
      if(roleName){
        const userListLike = await this.RoleService.findUserByRoleName(roleName)
        const users = userListLike.length > 0 ? userListLike.map((item:any) => item.user) : [];
        query.user = users.concat(query.user)
      }
      if(userName){
        const userListLike = await this.UserService.findUserByUserName(userName)
        const users = userListLike.length > 0 ? userListLike.map((item:any) => item.user) : [];
        query.user = users.concat(query.user)
      }
      // 如果name存在，则查询对应的user，User[]
      // 合并user,进行查询
      const result = await this.UserService.getUserList(query)
      const { data, count } = result;
      if(count > 0){
        // 给每个user，查询对应角色
        const userList = data.map((user:any) => {
          return user.dataValues.user;
        })
        const roleList = await this.RoleService.findRoleByUser(userList);
        data.forEach((user:any) => {
          user.dataValues.role = roleList.filter((role:any) => {
            return role.user === user.dataValues.user
          });
        })
      }
      res.status(HttpCodeSuccess).json({...Success, count, data});
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
