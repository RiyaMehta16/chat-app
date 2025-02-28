import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; //since this is a protected route, the req will have userId in it
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password"); //find all the users where ID !== currentUser's ID
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params; //"id" , because that's what we called it in "/:id" message.route.js
    const messages = await Message.find({
      //find all the messages between both the users
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { id: receiverId } = req.params;
    const { text, image } = req.body;
    //if the text is an image
    let imageUrl;
    if (image) {
      //uploading to cloudinary and storing the url in a variable
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    //creating the new message
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    //saving newMessage to the database
    await newMessage.save();
    //real-time functionality goes here=> socketio
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(socketID).emit("eventName", data)
      io.to(receiverSocketId).emit("newMessage", newMessage); //this is only taking care of where the message is to be sent
    }

    res.status(201).json(newMessage); //201 means resource has been created
  } catch (error) {
    console.error("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
