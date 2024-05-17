require('dotenv').config();
require('express-async-errors');

// Default Depedecies
const express = require('express');
const app = express();

// Import Database connect
const connectDB = require('./db/connect');

// Import Routes
const examRouter = require('./routes/exam');
const authRouter = require('./routes/auth');
// const userRouter = require('./routes/user')

const autheticationMiddleware = require('./middleware/authetication');

// Import Error Middleware
const notFoundMiddleware = require('./middleware/error-handler');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

// Router
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/exam',  autheticationMiddleware, examRouter);
// app.use('/api/v1/user', autheticationMiddleware, userRouter);

// Error Routes
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server listening on port ${port}...`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();
