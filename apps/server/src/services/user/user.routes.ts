import { Router } from 'express';
import * as controllers from './controllers';
import { isAuthorized, validate } from '../../middleware';

export const users = Router();

users.get('/', controllers.getUsers.handler);
users.get('/unique', isAuthorized, controllers.getUser.handler); // don't like this route name
users.post('/create', validate(controllers.createUser.schema), controllers.createUser.handler);
users.post('/delete', isAuthorized, controllers.deleteUser.handler); // essentially a self destruct route
users.post('/update', isAuthorized, validate(controllers.updateUser.schema), controllers.updateUser.handler);

// could just use different method to differentiate post routes but it's less readable and nobody is going to change my mind...
