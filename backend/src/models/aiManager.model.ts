import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { AIManager } from '../interfaces/aiManager.interface';

export type AIManagerCreationAttributes = Optional<AIManager, 'id'>;

export class AIManagerModel extends Model<AIManager, AIManagerCreationAttributes> implements AIManager {
  public id!: number;
  public name!: string;
  public model!: string;
  public api!: string;
  public api_key!: string;
  public status!: 1 | -1; // 状态（启用/禁用）
  public expired!: number;
  public create_time: number;
  public update_time: number;
  public created_by?: string | null;
  public updated_by?: string | null;
}

export default function (sequelize: Sequelize): typeof AIManagerModel {
  AIManagerModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'AI模型名称',
      },
      model: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'AI模型名称',
      },
      api: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'API地址',
      },
      api_key: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'API密钥',
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '状态（启用/禁用）',
      },
      expired: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '过期时间',
      },
      create_time: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '创建时间',
        defaultValue: 0,
      },
      update_time: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '更新时间',
        defaultValue: 0,
      },
      created_by: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '创建人',
      },
      updated_by: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '更新人',
      },
    },
    {
      tableName: 't_ai_manager',
      sequelize,
      timestamps: false
    }
  );

  return AIManagerModel;
}
