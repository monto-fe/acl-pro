import { Op } from 'sequelize';
import DB from '../databases';
import { RoleReq, Role } from '../interfaces/role.interface';
import { getUnixTimestamp } from '../utils';

class RoleService {
	public Role = DB.Role;
	public RolePermission = DB.RolePermission;
	public Resource = DB.Resource;
	public now:number = getUnixTimestamp();

	public async create(Data: RoleReq): Promise<any> {
		const data: RoleReq = {
			...Data,
			create_time: this.now,
			update_time: this.now
		}
		const res: any = await this.Role.create({ ...data });
		return res;
	}

	public async createRolePermission(Data: any): Promise<any> {
		const { namespace, role, name, describe, operator, permissions } = Data;
		const t = await DB.sequelize.transaction();
		try {
			// 新增角色
			const roleParams:any = {
				namespace,
				role,
				name,
    			describe,
    			operator,
				create_time: this.now,
    			update_time: this.now
			}
			const roleInfo: any = await this.Role.create({ ...roleParams }, { transaction: t });
			// 角色关联资源
			const permissionParams:any = permissions
			await this.RolePermission.bulkCreate(permissionParams.map((item: any) => {
				return {
					namespace,
					role_id: roleInfo.id,
					resource_id: item.resource_id,
					describe: item.describe,
					operator,
					create_time: this.now,
					update_time: this.now
				}
			}), { transaction: t });
			t.commit();
			return roleInfo;
		} catch (err) {
			await t.rollback();
			throw err;
		}
	}

	public async update(Data : Role): Promise<[number]> {
		const { id, describe } = Data;
		const params:Role = {
			...Data
		}

		if (describe) {
			params.describe = describe
		}

		if (Object.keys(params).length === 0) {
			return [0]
		}

		params.update_time = this.now
		const res: [number] = await this.Role.update({ ...params }, {
			where: { id }
		})
		return res;
	}
	
	public async deleteSelf(Data: any): Promise<any> {
		const { namespace, id } = Data;
		const res:any = await this.Role.destroy({
			where: { id, namespace }
		})
		return res;
	}

	/**
	 * 获取全部角色信息
	*/
	public async findWithAllChildren(Data: any): Promise<any> {
		const { namespace, role, limit, offset } = Data;
		const params:any = {
			namespace
		}
		if (role) {
			params.role = role
		}
		const result: any = await this.Role.findAndCountAll({ 
			where: params,
			limit,
			offset,
			order: [['id', 'DESC']]
		})
		// 查询role_id对应的role_permission
		const rolePermission: any = await this.RolePermission.findAll({
			where: {
				role_id: {
					[Op.in]: result.rows.map((item: any) => item.id)
				}
			}
		})
		result.rows.forEach((item: any) => {
			const rolePermissionItem = rolePermission.filter((rolePermissionItem: any) => rolePermissionItem.dataValues.role_id === item.dataValues.id)
			item.dataValues.role_permission = rolePermissionItem.map((rolePermissionItem: any) => rolePermissionItem.dataValues.resource_id)
		})
		return result;
	}

	/*
		现在有Resource表、RoleResource表，通过RoleResource表中的resourceId关联Resource表， RoleResource表中有role_id
		现在有参数role_id数组，我要查询所有role_id关联的Resource表中的数据
		请写出语句
	*/
	public async findResourceByRoleIds(roleIds: number[]) {
		const roleIdsStr = roleIds.join(',');
		const result: any = await DB.sequelize.query(`SELECT
		resource.* FROM t_resource AS resource JOIN t_role_permission WHERE
		resource.id = t_role_permission.resource_id
		and t_role_permission.role_id in (${roleIdsStr})`)
		return result;
	}
	// 通过user查询对应的角色信息
	public async findRoleByUser(user: string[]) {
		const result: any = await DB.sequelize.query(`SELECT
		role.*, t_user_role.user FROM t_role AS role JOIN t_user_role WHERE
		role.id = t_user_role.role_id
		and t_user_role.user IN (?)`, { replacements: [user], type: DB.sequelize.QueryTypes.SELECT })
		return result;
	}
	// 通过角色名称查询userId
	public async findUserByRoleName(roleName: string) {
		const result: any = await DB.sequelize.query(`SELECT
		t_user_role.user FROM t_user_role JOIN t_role WHERE
		t_user_role.role_id = t_role.id AND t_role.name LIKE ?`, { replacements: [`%${roleName}%`], type: DB.sequelize.QueryTypes.SELECT })
		return result;
	}
}

export default RoleService;