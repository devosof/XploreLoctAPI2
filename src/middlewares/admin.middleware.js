

// middlewares/adminAuthMiddleware.js
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new ApiError(403, 'No token provided');
    }

    jwt.verify(token, process.env.ADMIN_TOKEN_SECRET, (err, decoded) => {
        if (err || !decoded.isAdmin) {
            throw new ApiError(403, 'Invalid or expired token');
        }
        next();
    });
};

export default verifyAdmin;




// const verifyAdmin = (req, res, next) => {
//     const adminSecret = req.headers['admin-secret'];
//     if (adminSecret !== process.env.ADMIN_SECRET) {
//         throw new ApiError(403, "Unauthorized: Only admin access allowed");
//     }
//     next();
// };

// export default verifyAdmin;
