import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; //to parse token from the cookies(in middleware) res.cookies.jwt=> it contains info like user-id etc
import cors from "cors";
import authRoutes from "./routes/auth.route.js"; //we put ".js" for the local files not the modules
import messageRoutes from "./routes/message.route.js"; //we put ".js" for the local files not the modules
import { app, server } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";
dotenv.config();

// const app = express();
const PORT = process.env.PORT;

app.use(express.json()); //helps extract json data from the request from frontend
// app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data
app.use(cookieParser()); //ensure cookieParser is above the routes always
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, //for cookies headers authorization
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
//middleware
server.listen(PORT, () => {
  console.log(" server is running on PORT " + PORT);
  connectDB();
});
