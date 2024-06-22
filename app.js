require("dotenv").config();
require("express-async-errors");

// Depedecies
const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
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

//Import cron-jobs
const scheduleTask = require("./cron-jobs/main");

// Import Router
const examRouter = require("./routes/examRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");

const autheticationMiddleware = require("./middleware/authetication");

// Import Error Middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(express.json());
// app.use(morgan("tiny"));
app.use(cors());
app.use(helmet());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload({ useTempFiles: true }));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/exam", autheticationMiddleware, examRouter);
app.use("/api/v1/user", autheticationMiddleware, userRouter);

app.get("/", (req, res) => {
  res.send("Exam System");
});

// Error Routes
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
    scheduleTask();
  } catch (error) {
    console.log(error);
  }
};

start();
