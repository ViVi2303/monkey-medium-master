import { google } from "googleapis";
import env from "../config/env.js";

const generateOAuthAccessToken = async () => {
  const OAuth2Client = new google.auth.OAuth2(
    env.NODEMAILER_GOOGLE_CLIENT_ID,
    env.NODEMAILER_GOOGLE_CLIENT_SECRET
  );

  OAuth2Client.setCredentials({
    refresh_token: env.NODEMAILER_GOOGLE_REFRESH_TOKEN,
  });

  const accessToken = await OAuth2Client.getAccessToken();

  return accessToken;
};

export default generateOAuthAccessToken;
