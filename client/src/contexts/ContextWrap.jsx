import { Fragment } from "react";
import { AuthProvider } from "./auth-context";
import { SocketProvider } from "./SocketContext";
import { Outlet } from "react-router-dom";

const ContextWrap = () => {
  return (
    <Fragment>
      <AuthProvider>
        <SocketProvider>
          <Outlet></Outlet>
        </SocketProvider>
      </AuthProvider>
    </Fragment>
  );
};

export default ContextWrap;
