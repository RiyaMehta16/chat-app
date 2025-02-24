import express from "express";
import authRoutes from "./routes/auth.route.js"; //we put ".js" for the local files not the modules
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; //to parse token from the cookies(in middleware) res.cookies.jwt=> it contains info like user-id etc
import { connectDB } from "./lib/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); //helps extract json data from the request from frontend
// app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data

app.use(cookieParser()); //ensure cookieParser is above the routes always
app.use("/api/auth", authRoutes);
//middleware
app.listen(PORT, () => {
  console.log(" server is running on PORT " + PORT);
  connectDB();
});
