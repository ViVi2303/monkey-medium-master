import express from "express";
import env from "./config/env.js";
import morgan from "morgan";
import cors from "cors";
import MongoDB from "./databases/mongodb/connect.js";
import sequelize from "./databases/mysql/connect.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import socket from "./socket.js";

const app = express();

import checkToUnbanUsers from "./scripts/checkToUnbanUsers.js";
import deleteSocketUsers from "./scripts/deleteSocketUser.js";
import "./models/mysql/Association.js";
import "./services/passport.js";
import "./cron.js";
import http from "http";

import authRoute from "./routes/authRoute.js";
import muteRoute from "./routes/muteRoute.js";
import blockRoute from "./routes/blockRoute.js";
import userRoute from "./routes/userRoute.js";
import reportUserRoute from "./routes/reportUserRoute.js";
import profileRoute from "./routes/profileRoute.js";
import followProfileRoute from "./routes/followProfileRoute.js";
import topicRoute from "./routes/topicRoute.js";
import followTopicRoute from "./routes/followTopicRoute.js";
import artcileRoute from "./routes/articleRoute.js";
import likeRoute from "./routes/likeRoute.js";
import roleRoute from "./routes/roleRoute.js";
import reportArticleRoute from "./routes/reportArticleRoute.js";
import commentRoute from "./routes/commentRoute.js";
import readingHistoryRoute from "./routes/readingHistoryRoute.js";
import searchRoute from "./routes/searchRoute.js";
import fileRoute from "./routes/fileRoute.js";
import readingListRoute from "./routes/readingListRoute.js";
import notificationRoute from "./routes/notificationRouter.js";

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: `${env.CLIENT_HOST}:${env.CLIENT_PORT}` }));

MongoDB.connect();

sequelize
  .authenticate()
  .then(() => {
    console.log("connect to mysql database successfully");
  })
  .then(() => {
    deleteSocketUsers();
    checkToUnbanUsers();
  })
  .catch((error) => {
    console.log("can not connect to mysql database");
    console.log("ERROR =>", error);
  });

app.use(`/${env.API_VERSION}/auth`, authRoute);
app.use(`/${env.API_VERSION}/mute`, muteRoute);
app.use(`/${env.API_VERSION}/block`, blockRoute);
app.use(`/${env.API_VERSION}/user`, userRoute);
app.use(`/${env.API_VERSION}/report-user`, reportUserRoute);
app.use(`/${env.API_VERSION}/profile`, profileRoute);
app.use(`/${env.API_VERSION}/follow-profile`, followProfileRoute);
app.use(`/${env.API_VERSION}/topic`, topicRoute);
app.use(`/${env.API_VERSION}/follow-topic`, followTopicRoute);
app.use(`/${env.API_VERSION}/article`, artcileRoute);
app.use(`/${env.API_VERSION}/like`, likeRoute);
app.use(`/${env.API_VERSION}/role`, roleRoute);
app.use(`/${env.API_VERSION}/report-article`, reportArticleRoute);
app.use(`/${env.API_VERSION}/comment`, commentRoute);
app.use(`/${env.API_VERSION}/reading-history`, readingHistoryRoute);
app.use(`/${env.API_VERSION}/search`, searchRoute);
app.use(`/${env.API_VERSION}/file`, fileRoute);
app.use(`/${env.API_VERSION}/reading-list`, readingListRoute);
app.use(`/${env.API_VERSION}/notification`, notificationRoute);

app.use(errorMiddleware);

const httpServer = http.createServer(app);

socket.initializeSocket(httpServer);

httpServer.listen(env.SERVER_PORT, () => {
  console.log(`server is running on port: ${env.SERVER_PORT}`);
});
