import { NextFunction, Request, Response } from 'express';
import { NamespaceReq, Namespace, NamespaceReqList } from '../interfaces/namespace.interface';
import NamespaceService from '../services/namespace.service';
import { ResponseMap, HttpCodeSuccess } from '../utils/const';
import { pageCompute } from '../utils/pageCompute';

const { Success, ParamsError } = ResponseMap

interface NamespaceResult {
  rows: any[]; // 假设`rows`是一个数组，具体类型未知
  count: number; // `count`是一个数字
}

class NamespaceController {
  public NamespaceService = new NamespaceService();

  public getProjects = async (req: Request, res: Response, next: NextFunction) => {
    const { namespace, current, pageSize } = req.query as any;
    const pageParams = pageCompute(current, pageSize)
    const params: NamespaceReqList = {
      ...pageParams
    }
    if(namespace){
      params.namespace = namespace;
    }
    
    try {
      const result: NamespaceResult = await this.NamespaceService.findWithAllChildren(params);
      const { rows, count } = result;
      res.status(HttpCodeSuccess).json({ 
        ...Success, 
        data: rows || [],
        total: count 
      });
		} catch (error: any) {
      res.status(HttpCodeSuccess).json({ 
        ...Success, 
        message: error.message 
      });
		}
  }

  public createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: NamespaceReq = req.body;
      const remoteUser = req.headers['remoteUser']
      const { namespace, parent, name, describe } = query;
      
      if (!namespace || !name ) {
        res.status(HttpCodeSuccess).json({ ...ParamsError });
        return;
      }

      const result = await this.NamespaceService.checkNamespace({
        namespace,
        name
      });

      if(result){
        res.status(HttpCodeSuccess).json({ 
          ...ParamsError, 
          message: 'namespace or name already exists'
        });
        return
      }

      const namespaceParams: any = {
        namespace,
        name,
        operator: remoteUser
      }
      if (parent) {
        namespaceParams.parent = parent
      }
      if (describe) {
        namespaceParams.describe = describe
      }

			const createData: any = await this.NamespaceService.create(namespaceParams);
      res.status(HttpCodeSuccess).json({ 
        ...Success, 
        data: createData
      });
		} catch (error) {
			next(error);
		}
  }

  public updateProject = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const body: Namespace = req.body;
      const { id } = body;
      if(!id){
        res.status(HttpCodeSuccess).json({ 
          ...Error, 
          message: 'id is required'
        });
        return
      }
      const response: any = await this.NamespaceService.update(body)
      if(response){
        res.status(HttpCodeSuccess).json({ 
          ...Success, 
          data: response
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

  public deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: {id: number } = req.body;
      const { id } = body;
    
      const result: any = await this.NamespaceService.deleteSelf({
				id
      });
      if(result){
        res.status(HttpCodeSuccess).json({ 
          ...Success
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
}

export default NamespaceController;