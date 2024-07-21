import { Op } from 'sequelize'
import DB from '../databases';
import { RolePermissionReq, UserRoleReq } from '../interfaces/permission.interface'
import sequelize from 'sequelize';

class PermissionService {
	public RolePermission = DB.RolePermission;
	public UserRole = DB.UserRole;
	public Resource = DB.Resource;

	public async getRolePermissions(Data: any): Promise<any> {
		const { namespace, role_id, limit, offset } = Data;
		const { count, rows } = await this.RolePermission.findAndCountAll({
			where: {  
				namespace,
				role_id: role_id
			},
			limit,
			offset,
			order: [
				['id', 'DESC']
			]
		});
		return { rows, count };
	}
	
	public async assetRolePermission(Data: RolePermissionReq): Promise<any> {
		const { namespace, role_id, resource_id, operator, describe } = Data;
		const createTaskData: any = await this.RolePermission.create({ 
			namespace, 
			role_id, 
			resource_id, 
			operator, 
			describe 
		});
		return createTaskData;
	}

	// 批量存入用户角色权限
	public async AssertUserRole(Data: UserRoleReq): Promise<any> {
		const { namespace, user, role_ids, operator, create_time, update_time } = Data;
		const userRoleList = role_ids.map((role_id: number) => {
			return {
				namespace,
				user,
				role_id: role_id,
				status: 1,
				operator,
				create_time,
				update_time
			}
		})
		const result: any = await this.UserRole.bulkCreate(userRoleList)
		return result;
	}

	public async cancelRolePermissionReq(Data: any): Promise<any> {
		const { namespace, role_id, resource_id } = Data;
		const cancelRes: any = await this.RolePermission.destroy({ 
			where: {
				namespace,
				role_id: role_id,
				resource_id: resource_id
			}
		 });
		return cancelRes;
	}
	
	public async cancelUserRole(Data: any): Promise<any> {
		const { namespace, user, role_id, role_ids } = Data;
		if (role_id) {
			role_ids.push(role_id)
		}
		if (role_ids.length === 0) return { Success: true }
		const result: any = await this.UserRole.destroy({ 
			where: {
				namespace,
				user,
				role_id: {
					[Op.in]: role_ids
				},
			}
		})
		return result;
	}

	public async deleteSelf(Data: any): Promise<any>{
		const { userId, jobId, ...rest } = Data;
		const result: any = await this.RolePermission.findAll({
			where: {
				userId,
				jobId,
				...rest
			}
		})
		return result;
	}

	public async getSelfPermissions(Data: any): Promise<any> {
		const { namespace, user, category } = Data;
		// 先通过user查user_role表
		const user_role_ids: any = await this.UserRole.findAll({
			where: {
				user,
				namespace
			},
			attributes: ['role_id']
		})
		// 在通过role_id查role_permission表
		const role_permission_ids: any = await this.RolePermission.findAll({
			where: {
				role_id: {
					[Op.in]: user_role_ids.map((item: any) => item.role_id)
				},
				namespace
			},
			attributes: ['resource_id']
		})
		// 最后通过resource_id查t_resource表
		const resources: any = await this.Resource.findAll({
			where: {
				id: {
					[Op.in]: role_permission_ids.map((item: any) => item.resource_id)
				},
				namespace,
				category
			}
		})
		return resources
		// 连表查，先查用户角色，再查角色权限，根据角色权限返回所有的权限资源
		// const query:any = {
		// 	[`t_resource.namespace`]: namespace,
		// 	[`t_user_role.namespace`]: namespace,
		// 	[`t_user_role.user`]: user,
		// 	[`t_user_role.status`]: 1,
		// }
		// if (category) {
		// 	query[`t_resource.category`] = category
		// }
		
		// const result = await DB.Resource.findAll({
		// 	attributes: ['id', 'name', 'category', 'describe', 'resource', 'properties'],
		// 	include: [
		// 		{
		// 			model: DB.RolePermission,
		// 			as: 't_role_permission',
		// 			attributes: ['id', 'role_id', 'resource_id', 'describe', 'operator'],
		// 			include: [
		// 				{
		// 					model: DB.UserRole,
		// 					as: 't_user_role',
		// 				}
		// 			]
		// 		}
		// 	],
		// 	where: query,
		// 	order: [
		// 		['t_resource.category', 'asc'],
		// 		['t_resource.id', 'asc']
		// 	]
		// })
	}
}

export default PermissionService;