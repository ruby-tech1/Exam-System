const createTokenUser = ({ user }) => {
  if (user.role === "user") {
    return {
      userId: user._id,
      name: user.name,
      role: user.role,
      gender: user.gender,
    };
  }
  return { userId: user._id, name: user.name, role: user.role };
};

module.exports = createTokenUser;
