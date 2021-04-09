import * as express from 'express'
import { Application } from 'express'
import * as bodyParser from 'body-parser';
import { FunctionDiscovery } from './decorators';
import { Controller } from './controller';
import { AllExceptionFilterMiddleware, bodyParserMiddleware, RequestContextMiddleware } from './middlewares'

class App {
  public app: Application;

  constructor(controllers: any) {
    this.app = express.default()
    this.app.disable('x-powered-by')

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(RequestContextMiddleware)
  }

  private async initializeControllers(controllers: any) {
    this.app.use(
      bodyParserMiddleware,
      bodyParser.raw(),
      bodyParser.text({ type: 'text/*' }),
    )
    await Promise.all(controllers.map(async (item: any) => {
      const metadata = await FunctionDiscovery.scan(item)
      const controller = new Controller(new item(), metadata)
      const router = controller.registerAPIs()
      this.app.use(router)
    }))
    this.app.use(AllExceptionFilterMiddleware)
  }
  public async listen(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.app
        .listen(port, () => resolve())
        .on('error', function (err) {
          reject(err)
        })
    })
  }
}

export default App;