import OpenAI from "openai";
import DB from '../databases';
import { getUnixTimestamp } from '../utils';
import { AIManagerCreate } from '../interfaces/aiManager.interface';

class AIService {
    public AIManager = DB.AIManager;
    public now:number = getUnixTimestamp();
    public openai = new OpenAI({
        baseURL: "",
        apiKey: "",
    });

    public async addAIToken({
      name, model, api, api_key, status, expired, created_by
    }: AIManagerCreate): Promise<any> {
        const data: AIManagerCreate = {
          name,
          model,
          api,
          api_key,
          status,
          expired,
          created_by,
          create_time: this.now,
          update_time: this.now
        }
        const res: any = await this.AIManager.create({ ...data });
        return res;
    }
    public async getAIToken(): Promise<any> {
      const { count, rows } = await this.AIManager.findAndCountAll({
        order: [
          ['id', 'DESC']
        ]
      });
      return { rows, count };
    }
}

export default AIService;