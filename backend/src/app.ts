import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
// import passport from 'passport';
// import pkg from 'passport-local';
// import pkgJwt from 'passport-jwt';
import path from 'path';
import fs from 'fs';
import DB from './databases';
// import UserController from './controllers/user.controller';
import { authenticateJwt } from './middlewares/auth';
import { PORT, DOMAIN } from './config';
import { Routes } from './interfaces/routes.interface';
 
const corsOptions = {
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

class App {
	app: express.Application;
	port = 3000;
	constructor(routers: Routes[]) {
		this.port = Number(PORT) || this.port;
		this.app = express();
		this.connectToDatabase();
		this.initializeSwagger();
		this.initializeMiddlewares();
		this.initializeRoutes(routers);
	}

	private connectToDatabase() {
		DB.sequelize.sync();
	}

	private initializeMiddlewares() {
		// this.app.use(morgan(LOG_FORMAT, { stream }));
		this.app.use(cors(corsOptions));
		// this.app.use(hpp());
		// this.app.use(helmet());
		// this.app.use(compression());
		this.app.use(express.json({limit: '50mb'}));
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(authenticateJwt);
		// this.app.all('*', function(req, res, next) {
		  // console.log("req", req.body)
		  // res.setHeader("Content-Type", "application/json;charset=utf-8");
		  // next();
		// });
	}

	private initializeRoutes(routes: Routes[]) {
		routes.forEach(route => {
			this.app.use('/v1', route.router);
		});
	}

	private initializeSwagger() {
		const options = {
			swaggerDefinition: {
				openapi: '3.0.0',
				info: {
					title: '接口文档',
					version: '1.0.0',
					description:
						'swagger使用文档：https://swagger.io/docs/specification/basic-structure/',
				},
				servers: [{
					url: DOMAIN,
					description: '本地环境'
				}]
			},
			apis: ['./swagger/*.yaml'],
		};

		const specs = swaggerJSDoc(options);
		// 将 Swagger JSON 对象写入文件
		fs.writeFileSync('./swagger-output.json', JSON.stringify(specs, null, 2), 'utf-8');
		this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
		this.app.get('/swagger.json', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
			res.send(specs);
		});
	}
	public listen() {
		this.app.listen(this.port, () => {
			console.log(`TypeScript with Express
              http://localhost:${this.port}/`);
		});
	}
}

export default App;
