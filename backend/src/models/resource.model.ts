import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Resource } from '../interfaces/resource.interface';

export type ResourceAttributes = Optional<Resource, 'id'>;

export class ResourceModel extends Model<Resource, ResourceAttributes> implements Resource {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public namespace!: string;
  public category!: string;
  public resource!: string;
  public properties!: string;
  public name!: string;
  public describe!: string;
  public operator!: string;
  public readonly create_time!: number;
  public readonly update_time!: number;
}

export default function (sequelize: Sequelize): typeof ResourceModel {
  ResourceModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      namespace: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        comment: '所属项目组',
        defaultValue: '',
        // collate: 'utf8_bin',
      },
      category: {
          type: new DataTypes.STRING(128),
          allowNull: false,
          comment: '资源分类',
          // collate: 'utf8_bin',
          defaultValue: '',
      },
      resource: {
          type: new DataTypes.STRING(128),
          // collate: 'utf8_bin',
          allowNull: false,
          comment: '资源标识',
          defaultValue: '',
      },
      properties: {
          type: new DataTypes.TEXT,
          // collate: 'utf8_bin',
          allowNull: false,
          comment: '资源属性 (JSON Schema)',
      },
      name: {
          type: new DataTypes.STRING(128),
          // collate: 'utf8_bin',
          allowNull: false,
          comment: '资源标识',
          defaultValue: '',
      },
      describe: {
          type: new DataTypes.TEXT,
          // collate: 'utf8_bin',
          allowNull: false,
          comment: '描述',
      },
      operator: {
          type: new DataTypes.STRING(128),
          // collate: 'utf8_bin',
          allowNull: false,
          comment: '创建人',
          defaultValue: '',
      },
      create_time: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          comment: '创建时间',
          defaultValue: '0',
      },
      update_time: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          comment: '更新时间',
          defaultValue: '0',
      }
    },
    {
      tableName: 't_resource',
      sequelize,
      timestamps: false,
      indexes: [
          {
              name: 'name',
              fields: ['name'],
              unique: true,
          }
      ]
    },
  );

  return ResourceModel;
}
