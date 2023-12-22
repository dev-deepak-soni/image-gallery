const JWT = require('jsonwebtoken');

/* -------------------------------------------------------------------------- */
/*                                 JWT Auth Verify                            */
/* -------------------------------------------------------------------------- */

const middleware = async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({ status: 401, success: false, message: "Token required." });
      }
  
      const token = authorization.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ status: 401, success: false, message: "Invalid JWT passed." });
      }
  
      const decode = JWT.decode(token);
  
      if (!decode) {
        return res.status(401).json({ status: 401, success: false, message: "Authorization failed." });
      }
  
      const authData = await JWT.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        {
          ignoreExpiration: true,
        },
      );
  
      const todayDate = new Date().getTime();
  
      if (authData.exp < todayDate / 1000) {
        return res.status(401).json({ status: 401, success: false, message: "Token expired." });
      }
  
      req.authData = authData;
  
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, success: false, message: "Internal server error" });
    }
};
  

const signJwt = async (payloadData) => {
  const jwtPayload = payloadData;

  const tokenData = { ...payloadData };

  // JWT token with Payload and secret.
  tokenData.token = JWT.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_TIMEOUT_DURATION
  });

  const refresh_token = JWT.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_TIMEOUT_DURATION
  });

  return tokenData;
}


const isValidHttpUrl = (string) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

module.exports = {
  middleware, signJwt, isValidHttpUrl
};