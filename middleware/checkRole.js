const CustomError = require("../errors/index");

// const checkRoleUser = (req, res, next) => {
//   if (req.user.role !== "user") {
//     throw new CustomError.UnauthenticatedError("Authetication Invalid");
//   }
//   next();
// };

// const checkRoleAdmin = (req, res, next) => {
//   if (req.user.role !== "admin") {
//     throw new CustomError.UnauthenticatedError("Authetication Invalid");
//   }
//   next();
// };

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError("Unauthorized");
    }
    next();
  };
};

module.exports = { authorizePermissions };
