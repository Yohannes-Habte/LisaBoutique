import express from 'express';
import { getAllUsers, signinUser, signupUser, updateUserProfile } from '../controllers/userController.js';
import { isAuth } from '../utils/utils.js';

const userRouter = express.Router();

userRouter.post('/signup', signupUser);
userRouter.post('/signin', signinUser);
userRouter.get("/createAdmin")
userRouter.get('/', getAllUsers);
userRouter.get('/:id');
userRouter.put('/profile', isAuth, updateUserProfile);
userRouter.put('/:id');
userRouter.delete('/:id');  

export default userRouter;
