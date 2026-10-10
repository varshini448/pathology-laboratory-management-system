const requireExternalUserType = (...allowedTypes) => (req, res, next) => {
  const userType = req.user?.userType;

  if (!userType || !allowedTypes.includes(userType)) {
    return res.status(403).json({
      message: "You are not authorized to access this dashboard.",
    });
  }

  if (!req.user?.id) {
    return res.status(401).json({
      message: "A valid external account is required.",
    });
  }

  next();
};

module.exports = requireExternalUserType;
