import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
//simple http server
const server = http.createServer(app);
//socket io server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users {userId: socketId}
const userSocketMap = {};

//initializing socket io
io.on("connection", (socket) => {
  console.log("a new user is connected: ", socket.id);
  //receive userId from client
  const userId = socket.handshake.query.userId;
  //update userSocketMap
  if (userId) userSocketMap[userId] = socket.id;
  //io.emit to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //we're sending the keys which are userIds in this case
  socket.on("disconnect", () => {
    console.log("a user disconnected: ", socket.id);
    delete userSocketMap[userId]; //to delete this specific key from userSocketMap
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
//now go to index.js and delete that line of code from index.js in which "app" was being made from express and import this app
//then at last only, replace the app.listen with server.listen
//everything else remains as it is, thus only 3 lines of code was changed in index.js
