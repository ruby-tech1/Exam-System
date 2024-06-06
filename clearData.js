require("dotenv").config();
const Exam = require("./model/exam");
const userStudent = require("./model/user-student");
const userAdmin = require("./model/user-teacher");
const connectDB = require("./db/connect");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Database connection succeful!!!");
    await userStudent.deleteMany();
    await userAdmin.deleteMany();
    await Exam.deleteMany();
    console.log("Deletion Successfull!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
