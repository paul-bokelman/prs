import { Router } from 'express';
import * as controllers from './controllers';
import { isAuthorized, validate } from '../../middleware';

export const tasks = Router();

tasks.get('/list', isAuthorized, controllers.getTasks.handler); // util route
tasks.get('/list/:n', isAuthorized, validate(controllers.nthTask.schema), controllers.nthTask.handler);
tasks.get('/:id', isAuthorized, controllers.getTask.handler);
tasks.post('/create', isAuthorized, validate(controllers.createTask.schema), controllers.createTask.handler);
tasks.post('/:id/delete', isAuthorized, validate(controllers.deleteTask.schema), controllers.deleteTask.handler);
tasks.post('/:id/update', isAuthorized, validate(controllers.updateTask.schema), controllers.updateTask.handler);
