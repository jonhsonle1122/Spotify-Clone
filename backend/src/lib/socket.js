import { Server } from "socket.io";
import { Message } from "../models/message.model.js";
export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  const userSockets = new Map();
  const userActivities = new Map();
  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      //   console.log("user connect ", userId);
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle");
      io.emit("user_connected", userId);
      socket.emit("users_online", Array.from(userSockets.keys()));
      io.emit("activities", Array.from(userSockets.entries()));
    });

    socket.on("update_activity", ({ userId, activity }) => {
      console.log(activity);
      userActivities.set(userId, activity);
      io.emit("activity_updated", { userId, activity });
    });
    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;
        const message = await Message.create({ senderId, receiverId, content });

        const receiverSocket = userSockets.get(receiverId);
        // console.log(receiverSocket);
        // console.log(data);
        if (receiverSocket) {
          io.to(receiverSocket).emit("receive_message", message);
        }
        socket.emit("message_sent", message);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("message_error", error.message);
      }
    });
    socket.on("disconnect", () => {
      let disconnectedUserId;
      for (const [userId, socketId] of userSockets.entries()) {
        if (socket.id === socketId) {
          disconnectedUserId = userId;
          userSockets.delete(disconnectedUserId);
          userActivities.delete(disconnectedUserId);
          break;
        }
      }
      if (disconnectedUserId) {
        io.emit("user_disconnected", disconnectedUserId);
      }
    });
  });
};
