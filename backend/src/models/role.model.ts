import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Role } from '../interfaces/role.interface';
// import { RolePermissionModel } from './rolePermission.model';

export type RoleCreationAttributes = Optional<Role, 'id'>;

export class RoleModel extends Model<Role, RoleCreationAttributes> implements Role {
    public id: number; // Note that the `null assertion` `!` is required in strict mode.
    public namespace: string;
    public role: string;
    public name: string;
    public describe: string;
    public operator: string;
    public readonly create_time: number;
    public readonly update_time: number;
}

// RoleModel.hasMany(RolePermissionModel, {
    // foreignKey: 'role_id',
    // as: 'role_permission'
// });

export default function (sequelize: Sequelize): typeof RoleModel {
    RoleModel.init(
    {
      id: {
          type: DataTypes.INTEGER.UNSIGNED, // you can omit the `new` but this is discouraged
          autoIncrement: true,
          primaryKey: true,
      },
      namespace: {
          type: new DataTypes.STRING(512),
          allowNull: false,
          comment: '所属项目组',
          defaultValue: '',
      },
      role: {
          type: new DataTypes.STRING(512),
          allowNull: false,
          comment: '角色标识',
          defaultValue: '',
      },
      name: {
          type: new DataTypes.STRING(512),
          allowNull: false,
          comment: '角色中文名',
          defaultValue: '',
      },
      describe: {
          type: new DataTypes.STRING(512),
          allowNull: false,
          comment: '描述',
          defaultValue: '',
      },
      operator: {
          type: new DataTypes.STRING(512),
          allowNull: false,
          comment: '创建人',
          defaultValue: '',
      },
      create_time: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          comment: '创建时间',
          defaultValue: "0",
      },
      update_time: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          comment: '更新时间',
          defaultValue: '0',
      }
    },
    {
      sequelize,
      tableName: 't_role',
      timestamps: false,
    //   indexes: [
    //       {
    //           name: 'unique-namespace_name',
    //           fields: ['namespace', 'name'],
    //           unique: true,
    //       },
    //       {
    //           name: 'unique-namespace_role',
    //           fields: ['namespace', 'role'],
    //           unique: true,
    //       },
    //       {
    //           name: 'unique-namespace_id',
    //           fields: ['namespace', 'id'],
    //       }
    //   ]
    },
  );

  return RoleModel;
}