import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from 'cookie-parser';

// cors configuration (production level configuration)

dotenv.config({
    path: './.env'
});

const app = express();

const allowedOrigins = ["http://localhost:5173"]; // Replace with your frontend's origin

app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (allowedOrigins.includes(origin) || !origin) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // Allow credentials (cookies, headers)
//   })
// );



// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))


// data will come from different sources such as json, body, form , url etc.
app.use(express.json({limit: "16kb"})) // to config that we are accepting json.
// to handle data from URL
app.use(express.urlencoded({extended: true, limit: "16kb"}))
// to use static files usually from public folder
app.use(express.static("public"))


// cookieparser is to perform crud operation on cookies;
app.use(cookieParser())





// routes import
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import organizerRoutes from './routes/organizerRoutes.js';
import speakerRoutes from './routes/speakerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import errorHandler from './middlewares/errorHandler.js';




app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/organizers', organizerRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/admin', adminRoutes)
app.use(errorHandler); // Error handling middleware

export default app;



// import express from 'express';
// import userRoutes from './routes/userRoutes.js';
// import eventRoutes from './routes/eventRoutes.js';
// import { handleError } from './middlewares/errorHandler.js';

// const app = express();
// app.use(express.json());
// app.use('/api/users', userRoutes);
// app.use('/api/events', eventRoutes);
// app.use(handleError);

// export default app;
