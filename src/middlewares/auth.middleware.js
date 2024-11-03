import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

const verifyJWT = (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return next(new ApiError(401, 'Unauthorized'));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return next(new ApiError(401, 'Token is not valid'));
        }

        req.user = { id: decoded.id }; // Assuming the token contains the user ID
        next();
    });
};

export default verifyJWT;













// import jwt from 'jsonwebtoken';
// import {ApiError} from '../utils/ApiError.js';

// const verifyJWT = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//         throw new ApiError('Unauthorized', 401);
//     }
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             throw new ApiError('Token is not valid', 401);
//         }
//         req.user = { id: decoded.id }; // Assuming user ID is encoded in the token
//         next();
//     });
// };


// export default verifyJWT;
