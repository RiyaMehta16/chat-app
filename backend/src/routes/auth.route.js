//app.route.js in nothing but a js file, we added ".route" just so we know where the file is( in the route folder as it is a route file for authentication)
import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
