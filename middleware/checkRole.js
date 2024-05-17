const {UnauthenticatedError,} = require('../errors/index');

const checkRoleUser = (req, res, next) => {
    if(req.user.role !== 'user'){
        throw new UnauthenticatedError('Authetication Invalid');
    }
    next();
}

const checkRoleAdmin = (req, res, next) => {
    if(req.user.role !== 'admin'){
        throw new UnauthenticatedError('Authetication Invalid');
    }
    next();
}

module.exports = {checkRoleUser, checkRoleAdmin}