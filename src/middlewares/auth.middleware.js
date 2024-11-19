// auth/verifyJWT.js
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import knex from '../db/db.js';

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }

            req.user = { id: decoded.id };

            // Fetch user details including roles
            const user = await knex('users').where({ id: decoded.id }).first();
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized: User not found' });
            }

            req.user.isAdmin = user.isAdmin || false;
            req.user.isOrganizer = !!(await knex('organizers').where({ user_id: decoded.id }).first());

            next();
        });
    } catch (error) {
        console.error('Error in verifyJWT middleware:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
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













