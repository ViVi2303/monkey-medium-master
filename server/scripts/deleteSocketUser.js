import SocketUser from "../models/mongodb/SocketUser.js";

const deleteSocketUsers = async () => {
  try {
    await SocketUser.deleteMany();
    console.log("delete socket users successfully");
  } catch (error) {
    console.log("error when delete socket users", error);
  }
};

export default deleteSocketUsers;
