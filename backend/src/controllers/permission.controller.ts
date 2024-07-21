import { NextFunction, Request, Response } from 'express';
import { RolePermissionReq, UserRoleReq } from '../interfaces/permission.interface';
import PermissionService from '../services/permission.service';
import { ResponseMap, HttpCodeSuccess } from '../utils/const';
import { getUnixTimestamp } from '../utils';
import { pageCompute } from '../utils/pageCompute';
import { totalmem } from 'os';

const { Success, ParamsError } = ResponseMap

class PermissionController {
  public PermissionService = new PermissionService();


  public getRolePermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { namespace, role_id, current, pageSize } = req.body;
      const params: any = {
        namespace,
        role_id,
        ...pageCompute(current, pageSize)
      }
      const getData: any = await this.PermissionService.getRolePermissions(params);
      const { rows, count } = getData;
      res.status(HttpCodeSuccess).json({ 
        ...Success, 
        data: rows || [],
        total: count 
      });
		} catch (error) {
			next(error);
		}
  }

  public getSelfPermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { namespace, category } = req.body;
      const remoteUser = req.headers['remoteUser'] as string;
      const params = {
        namespace,
        user: remoteUser,
        category
      }
      const result: any = await this.PermissionService.getSelfPermissions(params);
      res.status(HttpCodeSuccess).json({ 
        ...Success, 
        data: result
      });
    }catch(error) {
      next(error);
    }
  }

  // 角色分配权限
  public assetRolePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: RolePermissionReq = req.body;
      const remoteUser = req.headers['remoteUser']
      const params  = query as any;
      
      if (!params) {
        res.status(HttpCodeSuccess).json({ ...ParamsError });
        return;
      }

			const createData: any = await this.PermissionService.assetRolePermission(
				{
          ...params,
          operator: remoteUser
        }
			);
      res.status(HttpCodeSuccess).json({ 
        ...Success, 
        data: createData
      });
		} catch (error) {
			next(error);
		}
  }

  // 给用户分配角色
  public assertUserRole = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { namespace, user, role_id, role_ids, describe }: UserRoleReq = req.body;
      const remoteUser = req.headers['remoteUser'] as string;
      const now = getUnixTimestamp();
      if(role_id){
        role_ids.push(role_id);
      }
      const params = {
          namespace,
          user,
          role_ids,
          operator: remoteUser,
          create_time: now,
          update_time: now,
          describe
      }
      const response: any = await this.PermissionService.AssertUserRole(params)
      
      res.status(HttpCodeSuccess).json({ 
        ...Success, 
        data: response
      });
		} catch (error) {
			next(error);
		}
  }

  public cancelRolePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: any = req.body;
      const { namespace, role_id, resource_id } = body;
    
      const response: any = await this.PermissionService.cancelRolePermissionReq({
				namespace, role_id, resource_id
      });
      res.status(HttpCodeSuccess).json({ 
        ...Success, 
        data: response
      });
		}catch  (error) {
			next(error);
		}
  }

  public cancelUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: any = req.body;
      const { namespace, user, role_id, role_ids=[] } = body;
      // TODO: 在controller校验参数，service不处理参数
      const result: any = await this.PermissionService.cancelUserRole({
				namespace, user, role_id, role_ids
      });
      if (result) {
        res.status(HttpCodeSuccess).json({...Success});
      }else{
        res.status(HttpCodeSuccess).json({...Error});
      }
		} catch (error) {
			next(error);
		}
  }

  // public checkPermission = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const body: any = req.body;
  //     const { namespace, user, resource } = body;
  //     const result: any = await this.PermissionService.checkPermission({
	// 			namespace, user, resource
  //     });
  //     if (result) {
  //       res.status(HttpCodeSuccess).json({...Success});
  //     }else{
  //       res.status(HttpCodeSuccess).json({...Error});
  //     }
	// 	} catch (error) {
	// 		next(error);
	// 	}
  // }
}

export default PermissionController;