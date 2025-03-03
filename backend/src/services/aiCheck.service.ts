import { Op } from 'sequelize';
import OpenAI from "openai";
import axios from 'axios';
import DB from '../databases';
import AIRuleService from './aiRule.service';
import AIService from './ai.service';
import { getUnixTimestamp } from '../utils';


const gitlabAPI = "" 
const enAbleStatus = 1

class AICheckService {
    public AIManager = DB.AIManager;
    public GitlabInfo = DB.GitlabInfo;
    public AIMessage = DB.AIMessage;
    public AIRuleService = new AIRuleService();
    public AIService = new AIService();

    public now:number = getUnixTimestamp();
    public openai = new OpenAI({
        baseURL: "",
        apiKey: "",
    });

    // 获取项目语言
    public async getProjectLanguages({
      gitlabAPI, 
      projectId,
      gitlabToken
    }:{
      gitlabAPI: string, 
      projectId: string, 
      gitlabToken: string
    }): Promise<{ [key: string]: number }> {
      const response = await axios.get(`${gitlabAPI}/v4/projects/${projectId}/languages`, {
        headers: {
          'PRIVATE-TOKEN': gitlabToken
        }
      });
    
      if (!response.data) {
        throw new Error('Failed to fetch project details');
      }
    
      const project = response.data;
      console.log("获取的语言类型:", project);
      return project;  // 返回项目的语言类型
    }

    // 计算并获取比例最大的语言
    public async getDominantLanguage ({
      gitlabAPI, projectId, gitlabToken
    }: {
      gitlabAPI: string, projectId: string, gitlabToken: string
    }):Promise<string> {
      try {
        let languages : { [key: string]: number } = await this.getProjectLanguages({ gitlabAPI, projectId, gitlabToken });

        // 计算总行数
        const totalLines = Object.values(languages).reduce((total: any, lines) => total + lines, 0);

        // 如果没有语言统计数据，返回 null
        if (totalLines === 0) {
          console.log('没有可用的语言统计数据');
          return '';
        }

        // 计算每种语言的占比，并找到占比最大的语言
        let dominantLanguage = "";
        let maxPercentage = 0;

        for (const [language, lines] of Object.entries(languages)) {
          const percentage: number = (lines / totalLines) * 100;
          if (percentage > maxPercentage) {
            maxPercentage = percentage;
            dominantLanguage = language;
          }
        }
        return dominantLanguage
      } catch (error) {
        console.error('发生错误:', error);
        return ''

      }
    }

    public async getMergeRequestInfo ({
      gitlabAPI, 
      projectId, 
      gitlabToken
    }:{
      gitlabAPI: string, projectId: string, gitlabToken: string
    }) {
      const response = await axios.get(`${gitlabAPI}/v4/projects/${projectId}/merge_requests`, {
        headers: {
          'PRIVATE-TOKEN': gitlabToken
        }
      });
    
      if (!response.data) {
        throw new Error('Failed to fetch merge requests');
      }
      
    
      const mergeRequests: any = response.data;
      return mergeRequests[0];  // 假设我们只取第一个合并请求
    }
    
    public async getMergeRequestDiff({
      gitlabAPI, projectId, mergeRequestId, gitlabToken
    }: {
      gitlabAPI: string,
      projectId: string,
      mergeRequestId: string,
      gitlabToken: string
    }) {
        const response = await axios.get(`${gitlabAPI}/v4/projects/${projectId}/merge_requests/${mergeRequestId}/changes`, {
          headers: {
            'PRIVATE-TOKEN': gitlabToken
          }
        });
      
        if (!response.data) {
          throw new Error('Failed to fetch merge request diff');
        }
      
        const diff: any = response.data;
        return diff.changes;  // 这里返回的是修改的文件列表和具体差异
    }
  
    public async checkMergeRequestWithAI({
      mergeRequest,
      diff,
      ai_model
    }:{
      mergeRequest: any,
      diff: any[], 
      ai_model: string
    }) {
        const { project_id, iid, title, description, web_url, author, updated_at } = mergeRequest;
        console.log("mergeRequest:", mergeRequest);
        // 1、获取项目信息和AI基本信息
        const gitlabInfo = await this.GitlabInfo.findOne({
          where: {
            status: enAbleStatus,
            expired: {
              [Op.gt]: Date.now()
            }
          }
        });
        const { gitlabAPI, gitlabToken } = gitlabInfo;
        console.log("gitlabInfo", gitlabInfo)
        const AIInfo = await this.AIManager.findOne({
          where: {
            status: enAbleStatus,
            expired: {
              [Op.gt]: Date.now()
            }
          }
        });
        console.log("AIInfo", AIInfo)
        // 在这里获取merge项目信息，匹配配置的代码规范，组合成AI提示词
        // TODO: 
        let currentRule = ''
        // 2、获取项目的对应规则
        const customRule = await this.AIRuleService.getCustomRuleByProjectId({project_id})
        console.log("customRule:", customRule);
        if(!customRule){
          currentRule = currentRule; 
        }else{
          const language: string = await this.getDominantLanguage({ gitlabAPI, projectId: project_id, gitlabToken })
          const commonRule = await this.AIRuleService.getCommonRule({ language })
          currentRule = commonRule;
        }
        // 3、组合提示词，调用AI模型进行检查
        // 4、将检查结果同步到数据库
      
        // 格式化信息
        const formattedInfo = `
          合并请求标题: ${title}
          描述: ${description || '无描述'}
          提交人: ${author.name}
          更新时间: ${updated_at}
          查看合并请求: ${web_url}
      
          代码差异:
          ${diff.map(change => `文件: ${change.new_path}\n差异:\n${change.diff}`).join('\n')}
      
          请检查上面的diff代码，要求上面代码符合以下原则：
            1. 表单必有校验
            2. 变量命名不要用1/2/3、尽量驼峰式、常量用全大写+下划线
            3. 公共链接只能用config配置的，根域名统一拿一套配置
            4. 枚举在代码里专用const.js里的，不要硬编码
          请输出：
          1. 如果diff代码不符合要求的规范，输出表格，展示不符合的代码、不符合的原则、修改建议。
          
          根据description描述信息，检查代码中疑似的Bug，如果没有可以不输出。
        `;
      
        // 调用 AI 模型进行检查
        const completion = await this.openai.chat.completions.create({
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: formattedInfo }
          ],
          model: ai_model,
        });

        // 将对应的信息，输入ai_message表，并返回结果
        const comments = completion.choices[0].message.content;
        try{
          this.AIMessage.create({
            project_id: project_id,
            merge_id: iid,
            ai_model: ai_model,
            rule: 1,
            rule_id: 1,
            result: comments,
          })
        }catch(err){
          console.log("err:", err);
        }
        return comments
    }

    public async postCommentToGitLab({
      comment, projectId, mergeRequestId, gitlabToken
    }:{
      comment: string, projectId: number, mergeRequestId: number, gitlabToken: string
    }): Promise<any> {
        const response = await axios.post(`${gitlabAPI}/v4/projects/${projectId}/merge_requests/${mergeRequestId}/notes`, 
          {
            body: comment,  // 这里是 AI 的检查结果
          },
          {
            headers: {
              'PRIVATE-TOKEN': gitlabToken,
              'Content-Type': 'application/json',
            }
          }
        );
      
        if (!response.data) {
          throw new Error('Failed to post comment to GitLab');
        }
      
        const result = response.data;
        return result;  // 返回 GitLab API 的响应结果
    }
}

export default AICheckService;