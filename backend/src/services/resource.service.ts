// const { Op } = require("sequelize");
import DB from '../databases';
import { ResourceReq, ResourceParams, Resource } from '../interfaces/resource.interface';
import { getUnixTimestamp } from '../utils';

class ResourceService {
	public Resource = DB.Resource;
	public now:number = getUnixTimestamp();

	public async create(Data: ResourceReq): Promise<any> {
		const data: ResourceParams = {
			...Data,
			create_time: this.now,
			update_time: this.now
		}
		const res: any = await this.Resource.create({ ...data });
		return res;
	}

	public async update(Data : Resource): Promise<[number]> {
		const { id } = Data;
		const params:Resource = {
			...Data,
			update_time: this.now
		}
		// 无更新项目
		if (Object.keys(params).length === 0) {
			return [0]
		}
		const res: [number] = await this.Resource.update({ ...params }, {
			where: { id }
		})
		return res;
	}
	
	public async deleteSelf(Data: any): Promise<any> {
		const { id } = Data;
		const res:any = await this.Resource.destroy({
			where: { id }
		})
		return res;
	}

	/**
	 * 获取项目组及其子项目组信息
	*/
	public async findWithAllChildren(Data: any): Promise<any> {
		const { namespace } = Data;
		const result: any = await this.Resource.findAndCountAll({ 
			where: {
				namespace,
			}
		 })
		return result;
	}
}

export default ResourceService;