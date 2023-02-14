const jwt = require("jsonwebtoken");

module.exports = jwtauthorize;

function jwtauthorize(roles = []) {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    //authorize based on user role
    (req, res, next) => {
      const cookie = req.cookies["jwt"];

      const claims = jwt.verify(cookie, "jwtSecret");
      if (!claims) {
        return res.sendStatus(401).send({ message: "unauthenticated" });
      }

      //console.log(claims.roles);

      if (roles.length && !roles.includes(claims.roles)) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      next();
    },
  ];
}
