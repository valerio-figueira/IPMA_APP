import express, { Application, Handler } from 'express';
import { Controllers } from '../controllers/Controllers';
import { MetadataKeys } from './MetadataKeys';
import { IRouter } from './decorators/HandlersDecorator';


export default async function RegisterRoutes(APP: Application) {
    const info: Array<{ api: string, handler: string }> = [];

    Controllers.forEach((controllerClass: any) => {
        const controllerInstance: { [handleName: string]: Handler } = new controllerClass() as any;

        const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, controllerClass);
        const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass);

        const exRouter = express.Router();

        routers.forEach(({ method, path, handlerName }) => {
            exRouter[method](path, controllerInstance[String(handlerName)].bind(controllerInstance));
            info.push({
                api: `${method.toLocaleUpperCase()} ${basePath + path}`,
                handler: `${controllerClass.name}.${String(handlerName)}`,
            });
        });
        APP.use(basePath, exRouter);
    });

    console.table(info);
}