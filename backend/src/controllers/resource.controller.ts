import { NextFunction, Request, Response } from 'express';
import { ResourceReq, Resource } from '../interfaces/resource.interface';
import ResourceService from '../services/resource.service';
import { ResponseMap, HttpCodeSuccess, ResourceCategory } from '../utils/const';
import { pageCompute } from '../utils/pageCompute';

const { Success, ParamsError } = ResponseMap

class ResourceController {
  public ResourceService = new ResourceService();

  public getResources = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: any = req.query;
      const { namespace, resource, name, category, current, pageSize } = query;
      if (!namespace) {
        res.status(HttpCodeSuccess).json(ParamsError);
        return;
      }
      const { offset, limit } = pageCompute(current, pageSize);

      const getData: any = await this.ResourceService.findWithAllChildren(
				{
          namespace,
          resource,
          name,
          category,
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
      const { namespace, category, resource, properties, name, describe } : ResourceReq = req.body;
      const remoteUser = req.headers['remoteUser'] as string;
      // 参数校验
      if(!namespace || !resource || !name){
        res.status(HttpCodeSuccess).json(ParamsError);
        return;
      }
      const params: any = {
        namespace,
        resource,
        name,
        describe,
        operator: remoteUser
      }
      if(!ResourceCategory.includes(category)){
        res.status(HttpCodeSuccess).json(ParamsError);
        return;
      }else{
        params.category = category;
      }
      if(properties){
        params.properties = properties;
      }
      // 校验name是否已存在
      const ResourceResult = await this.ResourceService.findByNamespaceAndName({
        namespace,
        name
      })
      if(ResourceResult){
        res.status(HttpCodeSuccess).json({ 
          ...ParamsError,
          message: '该资源已存在'
        });
        return
      }
      
			const createData: any = await this.ResourceService.create(params);
      
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
      const { id, namespace, category, resource, properties, name, describe }: Resource = req.body;
      // 先查询要更新的数据，判断是否存在
      if(!id || !namespace){
        res.status(HttpCodeSuccess).json(ParamsError);
        return;
      }
      const body: any = {
        id,
        namespace
      }
      const currentResource = await this.ResourceService.findAllById(id)
      if(!currentResource){
        res.status(HttpCodeSuccess).json({ 
          ...ParamsError,
          message: '该资源不存在'
        });
        return
      }

      // 校验name是否已存在
      if(name){
        // const ResourceResult = await this.ResourceService.findByNamespaceAndName({
        //   namespace,
        //   name
        // })
        // if(ResourceResult){
        //   res.status(HttpCodeSuccess).json({ 
        //     ...ParamsError,
        //     message: '要新增的资源已存在，无需重复添加'
        //   });
        //   return
        // }else{
          body.name = name;
        // }
      }
      
      if(!ResourceCategory.includes(category)){
        res.status(HttpCodeSuccess).json(ParamsError);
        return;
      }else{
        body.category = category;
      }
      if(properties){
        body.properties = properties;
      }
      if(describe){
        body.describe = describe;
      }
      if(resource){
        body.resource = resource;
      }

      const response: number[] = await this.ResourceService.update(body)
      res.status(HttpCodeSuccess).json({ 
        ...Success, 
        data: response
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