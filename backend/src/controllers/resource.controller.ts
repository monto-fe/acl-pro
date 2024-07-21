import { NextFunction, Request, Response } from 'express';
import { ResourceReq } from '../interfaces/resource.interface';
import ResourceService from '../services/resource.service';
import { ResponseMap, HttpCodeSuccess } from '../utils/const';
import { pageCompute } from '../utils/pageCompute';

const { Success, ParamsError } = ResponseMap

class ResourceController {
  public ResourceService = new ResourceService();

  public getResources = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: any = req.query;
      const { namespace, current, pageSize } = query;
      if (!namespace) {
        res.status(HttpCodeSuccess).json(ParamsError);
        return;
      }
      const { offset, limit } = pageCompute(current, pageSize);

      const getData: any = await this.ResourceService.findWithAllChildren(
				{
          namespace,
          offset,
          limit
        }
			);
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

  public createResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: ResourceReq = req.body;
      const remoteUser = req.headers['remoteUser']
      const params  = query as any;
      
      if (!params) {
        res.status(HttpCodeSuccess).json(ParamsError);
        return;
      }

			const createData: any = await this.ResourceService.create(
				{
          ...params,
          operator: remoteUser
        }
			);
      
      if(createData){
        res.status(HttpCodeSuccess).json({ 
          ...Success, 
          data: createData
        });
      }else{
        res.status(HttpCodeSuccess).json({ 
          ...ParamsError
        });
      }
		} catch (error) {
			next(error);
		}
  }

  public updateResource = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const body: any = req.body;
    
      const response: any = await this.ResourceService.update(body)
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

  public deleteResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: ResourceReq = req.body;
      const { id } = body;
    
      const getData: any = await this.ResourceService.deleteSelf({
				id
      });
      res.status(HttpCodeSuccess).json({ 
        ...Success, 
        data: getData
      });
		} catch (error) {
			next(error);
		}
  }
}

export default ResourceController;