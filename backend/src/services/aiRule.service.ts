import { Op } from 'sequelize';
import DB from '../databases';
import { } from '../interfaces/common.interface';
// import { } from '../interfaces/custom.interface'
import { getUnixTimestamp } from '../utils';

class AIRuleService {
	public CommonRule = DB.CommonRule;
    public CustomRule = DB.CustomRule;
	public now:number = getUnixTimestamp();

    public async getCommonRule({ language }: { language: string}): Promise<any> {
		// const { namespace, parent, name, describe, operator } = Data;
        // 先通过projectid获取对应的规则
        // 如果没有则通过language获取通用规则
        const rule = await this.CommonRule.findAll({
            where: {
                language: language,
                status: 1
            }
        })
        /* 循环rule，pick出language === language的规则，language全部转小写对比*/
        if(!rule.length){
            return [];
        }
        const pickRule = rule.filter((item:any) => {
            return item.language.toLowerCase === item.language.toLowerCase();
        })
		return pickRule;
	}
    public async getCustomRuleByProjectId({ project_id }: { project_id: string}): Promise<any> {
		// const { namespace, parent, name, describe, operator } = Data;
        // 先通过projectid获取对应的规则
        // 如果没有则通过language获取通用规则
        const rule = await this.CustomRule.findOne({
            where: {
                project_id: project_id,
                status: 1
            }
        })
        return rule;
    }
}

export default AIRuleService;