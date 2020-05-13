import auth from '../auth';

import { Router } from 'express';
import { userCtrl } from '../../controllers';

const user = Router();

user.get('/', auth.required, userCtrl.getUsers);
user.post('/', userCtrl.createUser);
user.delete('/:id', auth.required, userCtrl.deleteUser);
user.put('/:id', auth.required, userCtrl.updateUser);
user.post('/login', auth.optional, userCtrl.loginUser);
// user.get("/current", auth.required, async () => {});

export default user;
