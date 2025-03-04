import OpenAI from "openai";
import axios from 'axios';
import DB from '../databases';
import AIRuleService from './aiRule.service';
import { getUnixTimestamp } from '../utils';
import { generatePrompt } from '../utils/prompt';
import { AI_MODEL, AI_API, AI_KEY } from '../config';

class AICheckService {
    public AIManager = DB.AIManager;
    public GitlabInfo = DB.GitlabInfo;
    public AIMessage = DB.AIMessage;
    public AIRuleService = new AIRuleService();

    public now:number = getUnixTimestamp();
    public cache: any = {};
    public openai: any = new OpenAI({
        apiKey: AI_KEY,
        baseURL: AI_API
    });
    constructor () {
        if(!AI_MODEL || !AI_API || !AI_KEY){
            console.error("AI 信息未配置")
        }
    }

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
      gitlabAPI,
      gitlabToken
    }:{
      mergeRequest: any,
      diff: any[], 
      gitlabAPI: string,
      gitlabToken: string
    }) {
        const { project_id, iid, title, description, web_url, author, updated_at } = mergeRequest;
        // 在这里获取merge项目信息，匹配配置的代码规范，组合成AI提示词
        // TODO: 
        let currentRule = '符合代码行业的常规写法'
        // 2、获取项目的对应规则
        const customRule = await this.AIRuleService.getCustomRuleByProjectId({ project_id })
        console.log("customRule:", customRule);
        const { rule: userCustomRule, id: ruleId } = customRule?.dataValues || { rule: '', id: 1 };
        if(userCustomRule){
          currentRule = userCustomRule; 
        }else{
          const language: string = await this.getDominantLanguage({ gitlabAPI, projectId: project_id, gitlabToken })
          console.log("language:", language)
          const commonRule = await this.AIRuleService.getCommonRule({ language })
          currentRule = commonRule;
        }
      
        // 3、组合提示词，调用AI模型进行检查
        const formattedInfo = generatePrompt({
          rule: currentRule,
          title,
          description,
          author_name: author.name,
          web_url,
          diff
        })
        
        console.log("currentRule:", currentRule, formattedInfo)
        const completion = await this.openai.chat.completions.create({
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: formattedInfo }
          ],
          model: AI_MODEL
        });

        // 将对应的信息，输入ai_message表，并返回结果
        const comments = completion.choices[0].message.content;
        try{
          this.AIMessage.create({
            project_id: project_id,
            merge_id: iid,
            ai_model: AI_MODEL,
            rule: currentRule,
            rule_id: ruleId,
            result: comments,
          })
        }catch(err){
          console.log("err:", err);
        }
        return comments
    }

    public async postCommentToGitLab({
      comment, projectId, mergeRequestId, gitlabToken, gitlabAPI
    }:{
      comment: string, projectId: number, mergeRequestId: number, gitlabToken: string, gitlabAPI: string
    }): Promise<any> {
        console.log("comment:", `${gitlabAPI}/v4/projects/${projectId}/merge_requests/${mergeRequestId}/notes`)
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
        console.log("response:", response)
      
        if (!response.data) {
          throw new Error('Failed to post comment to GitLab');
        }
      
        const result = response.data;
        return result;  // 返回 GitLab API 的响应结果
    }
}

export default AICheckService;