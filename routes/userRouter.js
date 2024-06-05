const express = require("express");
const router = express.Router();

const { authorizePermissions } = require("../middleware/checkRole");
const {
  getAllUsers,
  showUser,
  updateUser,
  updateUserPassword,
} = require("../controller/userController");

router.route("/").get(authorizePermissions("admin"), getAllUsers);
router.route("/showUser").get(showUser);
router.route("/updateUser").patch(updateUser);
router.route("/updateUserPassword").patch(updateUserPassword);

module.exports = router;
