//app.route.js in nothing but a js file, we added ".route" just so we know where the file is( in the route folder as it is a route file for authentication)
import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
  googleAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
//we do not want this to be available for everyone , we need to check if they're logged in, only then they should be able to update their profile=> protectRoute(middleware)
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);
// New route for Google auth:
router.post("/google", googleAuth);

export default router;
