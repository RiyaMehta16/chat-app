import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Fill all the fields" });
    }
    if (password.length < 6) {
      //status(400)=> stands for error message
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    //checking if user exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // creating new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //generate jwt token after creating new user(created utils.js under lib directory for this)
      generateToken(newUser._id, res);
      //saving the user to the database
      await newUser.save();
      //sending response that it was successful
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid User Data!" });
    }
  } catch (error) {
    console.log("Error is signup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //compare the crypted passwords using bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //if user exists=>generate token
    generateToken(user._id, res);
    //sending response to show that login was successful
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error is login controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const logout = (req, res) => {
  try {
    //if we want to log someone out, we need to clear the cookies
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error is logout controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }
    //we have user from the protectRoute function which we will use here
    const userId = req.user._id;
    //uploading to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    //cloudinary is just a bucket to keep our images , we connect it to mongo using url from cloudinary image which will be returned as response
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true } //By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in Update Profile");
    res.status(500).json({ message: "Internal server error" });
  }
};
//this is the function which we will call on every refresh and depending on that we will take the user to the profile or the form
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller");
    res.status(500).json({ message: "Internal server error" });
  }
};
