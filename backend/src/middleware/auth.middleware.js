//can call it "protectRoute.js" as well, just a naming convention
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
//the "next" function will call the next function in the "auth.route.js" :
//router.put("/update-profile", protectRoute, updateProfile); ie "updateProfile" function if protectRoute function is executed successfully
export const protectRoute = async (req, res, next) => {
  try {
    //req.cookie."name" is why we are calling jwt, we can have other names as well while generating the cookie

    const token = req.cookies.jwt;
    //to parse=>cookieParser is used as the cookies (res.cookies.jwt) contain info like user_id etc and we need to decode it and grab that user_id, and we want user_id because we need it for the payload(check generateToken function)
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); //decoded will give userId

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Token Invalid" });
    }
    const user = await User.findById(decoded.userId).select("-password"); //selecting everything from the user except the password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //now user is authenticated, now we can add this user to the request of the "next" function
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
