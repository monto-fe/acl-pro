import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { AImessage } from '../interfaces/aiMessage.interface';

export type AImessageCreationAttributes = Optional<AImessage, 'id'>;

export class AImessageModel extends Model<AImessage, AImessageCreationAttributes> implements AImessage {
  public id!: number;
  public project_id!: number;
  public merge_id!: string;
  public ai_model!: "DeepSeek" | "ChatGPT" ;
  public rule!: 1 | 2;
  public rule_id!: number;
  public result!: string;
  public passed?: boolean;
  public checked_by?: string | null;
  public create_time!: number;
}

export default function (sequelize: Sequelize): typeof AImessageModel {
  AImessageModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      project_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: '项目ID',
      },
      merge_id: {
        type: new DataTypes.STRING(255),
        allowNull: false,
        comment: '合并mergeId',
      },
      ai_model: {
        type: new DataTypes.STRING(255),
        allowNull: false,
        comment: 'AI模型',
      },
      rule: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: '规则类型',
      },
      rule_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: '规则ID',
      },
      result: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: '结果',
      },
      passed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
        comment: '是否通过',
      },
      checked_by: {
        type: new DataTypes.STRING(255),
        allowNull: true,
        comment: '检查人',
      },
      create_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        comment: '创建时间',
      },
    },
    {
      sequelize,
      tableName: 't_ai_message',
      timestamps: false,  // `created_at` 不会自动更新，且我们不使用 `updated_at`
    }
  );

  // Foreign key constraints:
  // AImessageModel.belongsTo(sequelize.models.TCommonRule, { foreignKey: 'rule_id' });
  // AImessageModel.belongsTo(sequelize.models.TCustomRule, { foreignKey: 'project_id' });

  return AImessageModel;
}