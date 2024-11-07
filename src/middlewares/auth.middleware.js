// auth/verifyJWT.js
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import knex from '../db/db.js';

const verifyJWT = async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    if (!token) throw new ApiError(401, 'Unauthorized');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) throw new ApiError(401, 'Token is not valid');

        req.user = { id: decoded.id };

        // Fetch user details including roles
        const user = await knex('users').where({ id: decoded.id }).first();
        req.user.isAdmin = user.isAdmin || false;
        req.user.isOrganizer = !!(await knex('organizers').where({ user_id: decoded.id }).first());

        next();
    });
};

export default verifyJWT;
















// import jwt from 'jsonwebtoken';
// import { ApiError } from '../utils/ApiError.js';

// const verifyJWT = (req, res, next) => {
//     const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    
//     if (!token) {
//         return next(new ApiError(401, 'Unauthorized'));
//     }

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             return next(new ApiError(401, 'Token is not valid'));
//         }

//         req.user = { id: decoded.id }; // Assuming the token contains the user ID
//         next();
//     });
// };

// export default verifyJWT;













