import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';

import { Routes } from '../interfaces/routes.interface';
import UserController from '../controllers/user.controller';
import { checkSignToken, TokenSecretKey } from '../utils/util';
import { ResponseMap, HttpCodeSuccess } from '../utils/const'

const { LoginError } = ResponseMap

class Route implements Routes {
  public router = Router();
  public UserController = new UserController();

  constructor() {
    this.initializeRoutes();
    // this.authRoutes()
  }

  // private whiteActionList = ['Login', 'Register', 'GetUserInfo'];

  private initializeRoutes() {
    this.router.post('/login', this.UserController.login)
    this.router.get('/user', this.UserController.getUserList)
    this.router.post('/user', this.UserController.createInnerUser)
    this.router.put('/user', this.UserController.updateInnerUser)
    this.router.delete('/user', this.UserController.deleteUser)
    this.router.get('/userInfo', this.UserController.getUserInfo)
    // this.router.post('/register', this.UserController.register)
    // this.router.post('/email/code', this.UserController.sendEmailCode)
    // this.router.post('/reset/password', this.UserController.changePassword)
  }

  private authRoutes(){
    this.router.post(
      `*`,
      async (req: Request, res: Response, next: NextFunction) => {
        // // 权限拦截
        const jwtToken = req.header('jwt_token') as string;
        if (!jwtToken) {
          res.status(HttpCodeSuccess).json({ 
            ...LoginError
          });
          return;
        }
        // 这里只需要判断jwtToken是否过期，过期就判断没有登录
        try {
          const userInfo:any = await checkSignToken(jwtToken, TokenSecretKey)
          // TODO: 验证账号密码正确，讲道理这里感觉不用，因为生成的options参数密码是唯一的，生成的Token也是唯一的
          req.headers["remoteUser"] = userInfo.username
          req.headers["remoteUserId"] = userInfo.id
        }catch(err:any){
          // 如果过期，获取refreshToken有效期，如果过期就返回未登录
          // const refreshToken = req.header('refreshToken') as string;
          // if(!refreshToken){
          //   res.status(HttpCodeSuccess).json({ 
          //     ...LoginError
          //   });
          //   // res.status(200).json(TokenExpired);
          //   return;
          // }
          // try{
          //   const userInfo:any = await checkSignToken(refreshToken, TokenSecretKey)
          //   req.headers["remoteUser"] = userInfo?.username
          //   req.headers["remoteUserId"] = userInfo.id
          //   req.headers["jobId"] = userInfo.jobId
          // }catch(err){
          //   res.status(HttpCodeSuccess).json({ 
          //     ...Success
          //   });
          //   // res.status(200).json(TokenExpired);
          //   return;
          // } 
          res.status(HttpCodeSuccess).json({ 
            ...LoginError
          });
          return
        }
        next()
      }
    )

    // 更新用户信息
    this.router.put('/userInfo', this.UserController.updateUser)
  }
}

export default Route;