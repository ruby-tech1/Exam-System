const userStudent = require('../model/user-student');
const UserAdmin = require('../model/user-teacher');
const jwt = require('jsonwebtoken');
const {UnauthenticatedError,} = require('../errors/index');

const autheticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authetication Invalid');
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const payLoad = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {userId: payLoad.userId, role: payLoad.role};
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authetication Invalid');
    }
}



module.exports = autheticationMiddleware;