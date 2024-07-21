import { NextFunction, Request, Response } from 'express';
import { RoleReq, Role } from 'interfaces/role.interface';
import RoleService from '../services/role.service';
import { ResponseMap, HttpCodeSuccess } from '../utils/const';
import { pageCompute } from '../utils/pageCompute';
import ResourceService from '../services/resource.service';

const { Success, ParamsError, SystemEmptyError } = ResponseMap

class RoleController {
  public RoleService = new RoleService();
  public ResourceService = new ResourceService();

  public getRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { namespace, role, current, pageSize } = req.query as any;
      if (!namespace) {
        res.status(HttpCodeSuccess).json(ParamsError);
        return;
      }
      const params: any = { 
        namespace,
        ...pageCompute(current, pageSize) 
      }
      if (role) {
        params.role = role
      }
      const getData: any = await this.RoleService.findWithAllChildren(params);
      const { rows, count } = getData;
      // 聚合资源id
      const resourceIds = rows.map((item: any) => item.dataValues.role_permission).flat();
      if(resourceIds.length === 0){
        res.status(HttpCodeSuccess).json(SystemEmptyError);
        return 
      }
      // 根据resource资源列表
      const resourceList: any = await this.ResourceService.findAllByIds(resourceIds);
      rows.forEach((item: any) => {
        item.dataValues.resource = resourceList.filter((resource: any) => item.dataValues.role_permission.includes(resource.id));
      });
      res.status(HttpCodeSuccess).json({ 
        ...Success, 
        data: rows || [],
        total: count 
      });
		} catch (error) {
			next(error);
		}
  }

  public createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: RoleReq = req.body;
      const remoteUser = req.headers['remoteUser']
      const params  = query as any;
      
      if (!params) {
        res.status(HttpCodeSuccess).json(ParamsError);
        return;
      }

			const createData: any = await this.RoleService.create(
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

  public updateRole = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const body: Role = req.body;
    
      const response: any = await this.RoleService.update(body)
      const { rows, count } = response
      res.status(HttpCodeSuccess).json({ 
        ...Success, 
        data: rows || [],
        total: count 
      });
		} catch (error) {
			next(error);
		}
  }

  public deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, namespace } = req.body;
      const getData: any = await this.RoleService.deleteSelf({
        id,
				namespace
      });
      res.status(HttpCodeSuccess).json({ 
        ...Success, 
        data: getData
      });
		} catch (error) {
			next(error);
		}
  }

  public createRolePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: RoleReq = req.body;
      const remoteUser = req.headers['remoteUser']
      const params  = query as any;
      
      if (!params) {
        res.status(HttpCodeSuccess).json(ParamsError);
        return;
      }

			const createData: any = await this.RoleService.createRolePermission(
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
}

export default RoleController;