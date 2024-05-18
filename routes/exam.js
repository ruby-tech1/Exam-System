const express = require('express');
const router = express.Router();
// Import Authetication Middleware For routes
const {checkRoleUser, checkRoleAdmin} = require('../middleware/checkRole');

const {imageUpload,} = require('../controller/uploadFiles');
const {
    getExamsUser,
    getExamUser,
    createExam,
    startExam,
    endExam,
    getExamsAdmin,
    getExamAdmin,
    updateExam,
} = require('../controller/exam');

router.route('/createExam').post(checkRoleAdmin, createExam)
router.route('/startExam').post(checkRoleUser, startExam)
router.route('/endExam').post(checkRoleUser, endExam);
router.route('/updateExam').patch(checkRoleAdmin, updateExam)
router.route('/getExamsUser').get(checkRoleUser, getExamsUser);
router.route('/getExamUser/:id').get(checkRoleUser, getExamUser);
router.route('/getExamsAdmin').get(checkRoleAdmin, getExamsAdmin);
router.route('/getExamAdmin/:id').get(checkRoleAdmin, getExamAdmin);
router.route('/uploadImage').post(imageUpload)

module.exports = router;