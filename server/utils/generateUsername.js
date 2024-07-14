import { generateFromEmail } from "unique-username-generator";

const generateUsername = (email) => {
  if (email.includes("@gmail.com")) {
    return `@${email.split("@")[0]}`;
  }

  const username = generateFromEmail(email, 4);
  return `${username.slice(0, -4)}_${username.slice(-4)}`;
};

export default generateUsername;
