import jwt from 'jsonwebtoken';
import {ApiError} from '../utils/ApiError.js';

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new ApiError('Unauthorized', 401);
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            throw new ApiError('Token is not valid', 401);
        }
        req.user = { id: decoded.id }; // Assuming user ID is encoded in the token
        next();
    });
};


export default authenticate;
