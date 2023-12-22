const User = require("../model/loginModel");
const { hashAndSalt, compareHash } = require("../helper/bcrypt");
const { signJwt } = require("../helper/authentication");

/* -------------------- Google auth library --------------------- */
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const comparedPassword = await compareHash(password, user.password);

      if (!comparedPassword) {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Authentication failed",
        });
      }

      const payLoad = {
        user_id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
        address: user.address,
      };

      const jwtToken = await signJwt(payLoad);
      const { token } = jwtToken;

     return res.status(200).json({
        status: 200,
        success: true,
        message: "Login successful",
        token,
      });
    } else {
     return res.status(401).json({
        status: 401,
        success: false,
        message: "Authentication failed",
      });
    }
  } catch (error) {
    console.error("Login error:", error.message);
    return res
      .status(500)
      .json({ status: 500, success: false, message: "Internal server error" });
  }
};

exports.signup = async (req, res) => {
  const { username, email, password, age, address } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Username, email, and password are required",
      });
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        success: false,
        message: "Username or email already exists",
      });
    }

    const hashedPassword = await hashAndSalt(password);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword.hash,
      age,
      address,
    });

    await newUser.save();

    res.status(201).json({
      status: 201,
      success: true,
      message: "Signup successful",
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Registration failed",
    });
  }
};

exports.loginWithGoogle = async (req, res) => {
  try {
    const { authorization } = req.headers;

    try {
      const authToken = authorization.split(" ")[1];
      const ticket = await client.verifyIdToken({
        idToken: authToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const { email, picture, name } = ticket.getPayload();

      let user = await User.findOne({ email });

      if (!user) {
        user = new User({
          username: name,
          email,
        });

        await user.save();
      }

      const payLoad = {
        user_id: user._id,
        username: !user ? name : user.username,
        email: !user ? email : user.email,
      };

      const jwtToken = await signJwt(payLoad);
      const { token } = jwtToken;

      res.status(200).json({
        status: 200,
        success: true,
        message: "Login successful",
        token,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ status: 400, success: false, message: error.message });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};
