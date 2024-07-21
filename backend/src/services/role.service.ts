import DB from '../databases';
import { RoleReq, Role } from '../interfaces/role.interface';
import { getUnixTimestamp } from '../utils';

class RoleService {
	public Role = DB.Role;
	public RolePermission = DB.RolePermission;
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
		const { namespace, role } = Data;
		if (!namespace) {
			return []
		}
		const params:any = {
			namespace
		}
		if (role) {
			params.role = role
		}
		const result: any = await this.Role.findAndCountAll({ 
			where: params
		 })
		return result;
	}
}

export default RoleService;