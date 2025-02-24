//to generate a jwt token we need a JWT_SECRET in .env file
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
//to generate a token: we need payload like user_id
export const generateToken = (userId, res) => {
  //fetching key
  const JWT_SECRET = process.env.JWT_SECRET;
  //generating token
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
  //sending jwt in cookie
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //should be in milliseconds=> after 7 days it will expire and the user will need to login again
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks=>( an http specific cookie)
    sameSite: "strict", //CSRF attacks cross site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
