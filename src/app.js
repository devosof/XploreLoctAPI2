import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";

// cors configuration (production level configuration)

dotenv.config({
    path: './.env'
});

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


// data will come from different sources such as json, body, form , url etc.
app.use(express.json({limit: "16kb"})) // to config that we are accepting json.
// to handle data from URL
app.use(express.urlencoded({extended: true, limit: "16kb"}))
// to use static files usually from public folder
app.use(express.static("public"))






// routes import
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import errorHandler from './middlewares/errorHandler.js';



app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
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
