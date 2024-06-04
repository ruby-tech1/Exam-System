const { isTokenValid } = require("../utils/index");
const { UnauthenticatedError } = require("../errors/index");

const autheticationMiddleware = async (req, res, next) => {
  const { token } = req.signedCookies;

  if (!token) {
    throw new UnauthenticatedError("Authetication Invalid");
  }

  try {
    const payLoad = isTokenValid({ token });
    req.user = { userId: payLoad.userId, role: payLoad.role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authetication Invalid");
  }
};

module.exports = autheticationMiddleware;
