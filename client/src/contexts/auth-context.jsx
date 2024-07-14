import React, { useCallback, useEffect } from "react";
import { config } from "../utils/constants";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const { createContext, useContext, useState } = React;

const AuthContext = createContext();
// eslint-disable-next-line react/display-name
const AuthProvider = React.memo((props) => {
  const [userInfo, setUserInfo] = useState({});
  // console.log("userInfo:", userInfo);
  const value = { userInfo, setUserInfo };
  const [searchParams] = useSearchParams();
  const tokenParams = searchParams.get("token");
  const navigate = useNavigate();

  function getToken() {
    if (tokenParams) {
      localStorage.setItem("token", tokenParams);
      return tokenParams;
    }
    const tokenLocal = localStorage.getItem("token");
    if (tokenLocal) return tokenLocal;
    return null;
  }
  const token = getToken();
  console.log("token:", token);

  const fetcher = useCallback(async () => {
    if (!token) navigate("/sign-in");
    try {
      const response = await axios.get(
        `${config.SERVER_HOST}/profile/logged-in-profile-information`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success) {
        setUserInfo(response.data);
      }
      return null;
    } catch (error) {
      console.log("error:", error);
      localStorage.removeItem("token");
      navigate("/sign-in");
    }
  }, [navigate, token]);

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  return <AuthContext.Provider value={value} {...props}></AuthContext.Provider>;
});
function useAuth() {
  const context = useContext(AuthContext);
  if (typeof context === "undefined")
    throw new Error("useUser must be used within UserProvider");
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
