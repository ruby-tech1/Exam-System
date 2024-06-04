const express = require("express");
const router = express.Router();
// Import Authetication Middleware For routes
const { authorizePermissions } = require("../middleware/checkRole");

const { imageUpload } = require("../controller/uploadFiles");
const {
  getExamsUser,
  getExamUser,
  createExam,
  startExam,
  endExam,
  getExamsAdmin,
  getExamAdmin,
  updateExam,
} = require("../controller/examController");

router.route("/createExam").post(authorizePermissions("admin"), createExam);
router.route("/endExam").post(authorizePermissions("user"), endExam);
router.route("/updateExam").patch(authorizePermissions("admin"), updateExam);
router.route("/getExamsUser").get(authorizePermissions("user"), getExamsUser);
router
  .route("/getExamsAdmin")
  .get(authorizePermissions("admin"), getExamsAdmin);
router.route("/uploadImage").post(authorizePermissions("user"), imageUpload);
router.route("/startExam/:id").get(authorizePermissions("user"), startExam);
router.route("/getExamUser/:id").get(authorizePermissions("user"), getExamUser);
router
  .route("/getExamAdmin/:id")
  .get(authorizePermissions("admin"), getExamAdmin);

module.exports = router;
