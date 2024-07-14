import reactRefresh from "@vitejs/plugin-react-refresh";
import dotenv from "dotenv";

dotenv.config();

export default {
  plugins: [reactRefresh()],
};
