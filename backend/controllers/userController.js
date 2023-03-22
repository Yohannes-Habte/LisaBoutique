import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import { generateToken } from '../utils/utils.js';

//=====================================================================
// Signup User
//=====================================================================
export const signupUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const findUser = await User.findOne({ email: email });
    if (findUser) {
      return next(
        createError(401, 'Email has been already taken. Please try again!')
      );
    }

    if (!findUser) {
      const newUser = new User({
        name: name,
        email: email,
        password: bcrypt.hashSync(password),
      });

      const user = await newUser.save();

      return res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
    }
  } catch (error) {
    return next(createError(404, 'User could not signup. Please try again!'));
  }
};

//=====================================================================
// Signin User
//=====================================================================
export const signinUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // Check password
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        return next(createError(400, 'Invalid password. Please try again!'));
      }

      // If user exist and password is valid, then the response will be:
      if (user && isPasswordValid) {
        return res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
      } else {
        res.status(400);
        throw new Error('Invalide Email or password');
      }
    }
  } catch (error) {
    console.log(error);
    return next(createError(400, 'User could not login. Please try again!'));
  }
};

//=====================================================================
// Update User Profile
//=====================================================================
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      return res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    return next(
      createError(500, 'Database could not queried. Please try again!')
    );
  }
};

//=====================================================================
// Get all User
//=====================================================================

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.send({users: users});
  } catch (error) {
    return next(
      createError(500, 'Database could not be queried. Please try again!')
    );
  }
};
