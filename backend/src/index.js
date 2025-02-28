import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; //to parse token from the cookies(in middleware) res.cookies.jwt=> it contains info like user-id etc
import cors from "cors";
import authRoutes from "./routes/auth.route.js"; //we put ".js" for the local files not the modules
import messageRoutes from "./routes/message.route.js"; //we put ".js" for the local files not the modules
import { app, server } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";
import path from "path"; //node module
dotenv.config();

// const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();

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
//for PRODUCTION , we want to change the static folder from "frontend" entirely to "dist" which is compressed version of it============================================================================
if (process.env.NODE_ENV === "production") {
  //static middleware from express
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  //if we visit the above urls{like /api/auth or /api/messages}, then for that the following will be the entry point:
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

//middleware
server.listen(PORT, () => {
  console.log(" server is running on PORT " + PORT);
  connectDB();
});
