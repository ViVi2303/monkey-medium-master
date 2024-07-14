import { Server } from "socket.io";
import SocketUser from "./models/mongodb/SocketUser.js";
import env from "./config/env.js";

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: { origin: `${env.CLIENT_HOST}:${env.CLIENT_PORT}` },
  });
  io.on("connection", (socket) => {
    socket.on("new-user", async (data) => {
      const socketUser = await SocketUser.findOne({ socketId: socket.id });
      if (!socketUser) {
        await SocketUser.create({ userId: data.userId, socketId: socket.id });
      }
    });

    socket.on("disconnect", async () => {
      await SocketUser.findOneAndDelete({ socketId: socket.id });
    });
  });

  return io;
};

const getIO = () => {
  if (io) return io;
};

export default { initializeSocket, getIO };
