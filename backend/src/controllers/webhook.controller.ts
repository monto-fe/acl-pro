import { NextFunction, Request, Response } from 'express';
import AICheckService from '../services/aiCheck.service';
import GitlabService from '../services/gitlab.service';
import AIService from '../services/ai.service';
import ResponseHandler from '../utils/responseHandler';

class WebhookController {
  public AICheckService = new AICheckService();
  public AIService = new AIService();
  public GitlabService = new GitlabService();

  public AICheck = async (req: Request, res: Response, next: NextFunction) => {
    const { project: { id }, object_attributes: { iid } } = req.body;

    // 获取gitlab信息
    const gitlabInfo = await this.GitlabService.getGitlabInfo();
    if(gitlabInfo.length === 0){
        ResponseHandler.error(res, {}, '请配置gitlab Token');
        return
    }
    const { api: gitlabAPI, token: gitlabToken, expired } = gitlabInfo[0].dataValues;
    console.log("gitlabInfo", gitlabAPI, gitlabToken, expired)
    
    // 获取merge信息
    const mergeRequest = await this.AICheckService.getMergeRequestInfo({
      gitlabAPI: gitlabAPI, projectId: id, gitlabToken
    });

    // 读取diff信息
    const diff = await this.AICheckService.getMergeRequestDiff({
      gitlabAPI: gitlabAPI,
      projectId: id,
      gitlabToken,
      mergeRequestId: iid
    });
    
    // TODO: 根据项目gitlab token和项目id获取对应的规则：优先自定义规则
    // TODO: 如果没有自定义规则，则根据项目的语言，获取通用规则
    // 组装AI提示词，发送给AI，获取结果
    console.log("获取的合并请求差异:", diff);
    const result:any = await this.AICheckService.checkMergeRequestWithAI({
      mergeRequest, 
      diff,
      gitlabToken: gitlabToken
    });

    console.log("AI检查结果:", result);
    
    // 将 AI 检查结果作为评论写入 GitLab
    const commentResponse = await this.AICheckService.postCommentToGitLab({
      comment: result,
      mergeRequestId: iid,
      projectId: id,
      gitlabToken,
    });
    console.log("评论已成功提交:", commentResponse);
    ResponseHandler.success(res, { projectId: id, mergeRequestId: iid, comment: result}, 'AI检查结果');
  }
}

export default WebhookController;