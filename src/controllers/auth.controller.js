import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const secret = process.env.JWT_SECRET;

const createAccessToken = (data) => {
  console.log(process.env.JWT_SECRET);
  if (!process.env.JWT_SECRET) {
    throw new Error("Jwt secret is not defined");
  }
  return jwt.sign(data, process.env.JWT_SECRET);
};

const verifyToken = (token) => {
  if (!token) {
    throw new Error("no access token");
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const loginWithPassword = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await User.findOne({ email });
  if (!user) {
    return next(`no user with given email ${email}`);
  }

  if (!user.correctPassword(password)) {
    return next("invalid password");
  }

  const token = createAccessToken({ _id: user._id, name: user.name, email });
  res.cookie("authToken", token, {
    maxAge: 20 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "login success",
    token,
  });
};

export const logout = (req, res, next) => {
  res.status(200).json({ message: "Logout sucess", token: "invalid" });
};

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const newUser = await User.create({ username, email, password });
  const token = createAccessToken({ _id: newUser._id, username, email });
  res.cookie("authToken", token, {
    maxAge: 20 * 24 * 60 * 60 * 60,
  });
  res.status(200).json({
    message: "Signup sucess",
    token,
  });
};

export const protect = async (req, res, next) => {
  let token = "";
  if (req.cookies && req.cookies.authToken) {
    token = req.cookies.authToken;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next("you're not authenticated. Please login to continue.");
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    return next("invalid token");
  }
};
