import auth from '../auth';

import { Router } from 'express';
import { userCtrl } from '../../controllers';

const user = Router();

user.get('/', auth.required, userCtrl.getUsers);
// POST new user route (optional, everyone has access)
user.post('/', userCtrl.createUser);
user.delete('/:id', auth.required, userCtrl.deleteUser);
user.put('/:id', auth.required, userCtrl.updateUser);
// POST login route (optional, everyone has access)
user.post('/login', auth.optional, userCtrl.loginUser);

// GET current route (required, only authenticated users have access)
// user.get("/current", auth.required, async () => {});

export default user;
