const express = require("express");
const router = express.Router();
// Import Authetication Middleware For routes
const { authorizePermissions } = require("../middleware/checkRole");

const { imageUpload } = require("../controller/uploadFiles");
const {
  getAllExams,
  getSingleExam,
  createExam,
  startExam,
  endExam,
  updateExam,
  deleteExam,
  deployExam,
} = require("../controller/examController");

router.route("/").get(getAllExams);
router.route("/createExam").post(authorizePermissions("admin"), createExam);

router.route("/endExam").post(authorizePermissions("user"), endExam);
router.route("/uploadImage").post(authorizePermissions("admin"), imageUpload);

router
  .route("/:id")
  .get(getSingleExam)
  .patch(authorizePermissions("admin"), updateExam)
  .delete(authorizePermissions("admin"), deleteExam);
router.route("/:id/startExam").get(authorizePermissions("user"), startExam);
router
  .route("/:id/deployExam")
  .patch(authorizePermissions("admin"), deployExam);

module.exports = router;
