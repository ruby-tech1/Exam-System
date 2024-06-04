require("dotenv").config();
require("express-async-errors");

// Depedecies
const express = require("express");
const app = express();

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Import Database connect
const connectDB = require("./db/connect");

// Import Router
const examRouter = require("./routes/examRouter");
const authRouter = require("./routes/authRouter");

const autheticationMiddleware = require("./middleware/authetication");

// Import Error Middleware
const notFoundMiddleware = require("./middleware/error-handler");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
app.use(morgan("tiny"));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload({ useTempFiles: true }));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/exam", autheticationMiddleware, examRouter);
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
    });
  } catch (error) {
    console.log(error);
  }
};

start();
