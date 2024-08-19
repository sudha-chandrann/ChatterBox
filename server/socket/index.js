import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { User } from '../models/user.model.js';
import { Server } from 'socket.io';
import UserRouter from '../Routes/user.routes.js';
import MessageRouter from "../Routes/messages.routes.js"
import getUserDetailsFromToken from '../middleware/authmiddleware.js';
import { Chat } from '../models/chat.model.js';
import {Message} from "../models/message.model.js";
import getchatHistory from '../helper/getChatHistory.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({
  limit: "16kb"
}));
app.use(express.urlencoded({
  extended: true,
  limit: "16kb"
}));
app.use(cookieParser());

// Routes
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/messages', MessageRouter);

// HTTP and WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true
  }
});
const onlineUser = new Set()
const socketUserMap = new Map();
io.on('connection', async (socket) => {
  // This event triggers when a new client connects to the server.
  console.log('A new client connected', socket.id);

  try {
      // Extract token from the socket handshake authentication
      const token = socket.handshake.auth.token;
      if (!token) {
          // If no token is provided, disconnect the client
          console.log('No token provided');
          socket.disconnect();
          return;
      }

      // Validate the token and fetch the user details
      const user = await getUserDetailsFromToken(token);
    
      // If the token is invalid or expired, disconnect the client
      if (user?.logout) {
          console.log('Invalid or expired token:', user.message);
          socket.disconnect();
          return;
      }

      // Store the socket ID and user in a map and mark the user as online
      socketUserMap.set(socket.id, user);
      socket.join(user?._id.toString()); // Join a room identified by the user's ID
      onlineUser.add(user?._id?.toString()); // Add user to the set of online users
      io.emit('onlineUser', Array.from(onlineUser)); // Notify all clients of the updated online users list

      // Handle event when a user navigates to the message page
      socket.on('message-page', async (userid) => {
          // Fetch the details of the other user being communicated with
          const userDetails = await User.findById(userid).select("-password");
          const payload = {
              _id: userDetails?._id,
              name: userDetails?.name,
              email: userDetails?.email,
              profile_pic: userDetails?.profile_pic,
              onlineStatus: onlineUser.has(userid) // Check if the user is online
          };
          // Send the user's details to the client
          socket.emit('message-user', payload);
      });

      // Handle event when a new message is sent by the user
      socket.on('send-newmessage', async (data) => {
          // Create a new message in the database
          const newmessage = await Message.create({
              sender: data.sender,
              receiver: data.receiver,
              text: data.text,
              imageurl: data.imageurl,
              videourl: data.videourl,
          });

          // Check if a chat exists between the sender and receiver, if not, create one
          let chat = await Chat.findOne({
              "$or": [
                  { sender: data?.sender, receiver: data?.receiver },
                  { sender: data?.receiver, receiver: data?.sender }
              ]
          });
          if (!chat) {
              const createchat = await Chat({
                  sender: data?.sender,
                  receiver: data?.receiver
              });
              chat = await createchat.save();
          }

          // Update the chat with the new message
          const updatechat = await Chat.findByIdAndUpdate(chat._id, {
              $push: { messages: newmessage._id }
          }, { new: true });

          // Fetch the updated chat messages and send them to both sender and receiver
          const getchatmessages = await Chat.findOne({
              "$or": [
                  { sender: data?.sender, receiver: data?.receiver },
                  { sender: data?.receiver, receiver: data?.sender }
              ]
          }).populate('messages').sort({ updatedAt: -1 });
          io.to(data?.sender).emit('chatmessages', getchatmessages?.messages || []);
          io.to(data?.receiver).emit('chatmessages', getchatmessages?.messages || []);

          // Update and send the conversation history to both sender and receiver
          const conversationReceiver = await getchatHistory(data?.receiver);
          const conversationSender = await getchatHistory(data?.sender);
          io.to(data?.receiver).emit('conversations', conversationReceiver);
          io.to(data?.sender).emit('conversations', conversationSender);
      });

      // Handle event to fetch the chat history for a specific user
      socket.on('chat-history', async (userid) => {
          const chats = await getchatHistory(userid);
          socket.emit('chats', chats);
      });

      // Handle event to mark messages as seen by the user
      socket.on('markseen', async (senderid) => {
          // Find the chat between the current user and the sender
          let chat = await Chat.findOne({
              "$or": [
                  { sender: user?._id, receiver: senderid },
                  { sender: senderid, receiver: user?._id }
              ]
          });
          const conversationMessageId = chat?.messages || [];
          // Mark all messages sent by the sender as seen
          const updateMessages = await Message.updateMany(
              { _id: { "$in": conversationMessageId }, sender: senderid },
              { "$set": { seen: true }}
          );

          // Update and send the conversation history to both users
          const conversationSender = await getchatHistory(user?._id?.toString());
          const conversationReceiver = await getchatHistory(senderid);
          io.to(user?._id?.toString()).emit('conversation', conversationSender);
          io.to(senderid).emit('conversation', conversationReceiver);

          // Fetch the updated chat messages and send them to both users
          const getchatmessages = await Chat.findOne({
              "$or": [
                  { sender: senderid, receiver: user?._id },
                  { sender: user?._id, receiver: senderid }
              ]
          }).populate('messages').sort({ updatedAt: -1 });
          io.to(user?._id).emit('updatechatmessages', getchatmessages?.messages || []);
          io.to(senderid).emit('updatechatmessages', getchatmessages?.messages || []);
      });

  } catch (error) {
      // Handle any errors that occur during the connection or event processing
      console.error('Error during authentication:', error.message);
      socket.disconnect();
  }

  // Handle event when the client disconnects
  socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);

      const user = getUserFromSocket(socket); // Retrieve the user based on the socket ID
      if (user) {
          // Remove the user from the online users list and notify all clients
          onlineUser.delete(user._id.toString());
          io.emit('onlineUser', Array.from(onlineUser));
          socketUserMap.delete(socket.id); // Clean up the socket-user map
      }
  });
});

// Function to retrieve user details from the Map using socket.id
function getUserFromSocket(socket) {
    return socketUserMap.get(socket.id);
}



// Export both the app and the server
export {
  app,
  server
};
