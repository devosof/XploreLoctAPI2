import User from '../models/User.js';
import {AsyncHandler} from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';

export const createUser = AsyncHandler(async (req, res) => {
  const { username, email, phone, password } = req.body;
  const avatar = req.file ? await uploadOnCloudinary(req.file.path) : null;

  const newUser = await User.create({
    username, email, phone, password,
    avatar_url: avatar ? avatar.secure_url : null
  });

  res.status(201).json(new ApiResponse(201, newUser, 'User created successfully'));
});

export const getUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json(new ApiResponse(200, user, 'User retrieved successfully'));
});
