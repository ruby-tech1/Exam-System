const { isTokenValid } = require("../utils/index");
const { UnauthenticatedError } = require("../errors/index");

const autheticationMiddleware = async (req, res, next) => {
  const { token } = req.signedCookies;

  if (!token) {
    throw new UnauthenticatedError("Authetication Invalid");
  }

  try {
    const { userId, name, role } = isTokenValid({ token });
    req.user = { userId, name, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authetication Invalid");
  }
};

module.exports = autheticationMiddleware;
