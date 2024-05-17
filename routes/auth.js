const express = require('express');
const router = express.Router();

const {
    registerUser,
    registerAdmin,
    loginUser,
    loginAdmin,
    logoutUser,
    logoutAdmin,
} = require('../controller/auth')

router.route('/registerUser').post(registerUser);
router.route('/registerAdmin').post(registerAdmin);
router.route('/loginUser').post(loginUser);
router.route('/loginAdmin').post(loginAdmin);
router.route('/logoutUser').post(logoutUser);
router.route('/logoutAdmin').post(logoutAdmin);


module.exports = router