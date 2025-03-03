import { Router } from 'express';

import { Routes } from '../interfaces/routes.interface';
import WebhookController from '../controllers/webhook.controller';

class Route implements Routes {
  public router = Router();
  public WebhookController = new WebhookController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/webhook/merge', this.WebhookController.AICheck)
  }
}

export default Route;