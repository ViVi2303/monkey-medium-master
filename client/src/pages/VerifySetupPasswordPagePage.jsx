import styled from "styled-components";
import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { apiVerifySetupPassword } from "../api/apisHung";
import logo from "../assets/logo.png";
import { Image } from "antd";

const VerifySetupPasswordPageStyle = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

const VerifySetupPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const tokenParams = searchParams.get("token");
  const [verify, setVerify] = useState({});

  useEffect(() => {
    async function verifyToken() {
      const response = await apiVerifySetupPassword(tokenParams);
      setVerify(response);
    }
    verifyToken();
  }, [tokenParams]);

  return (
    <VerifySetupPasswordPageStyle>
      <div className="flex items-center justify-center gap-4 mt-5 logo">
        <Image width={40} preview={false} src={logo} />
        <h1 className="font-serif font-semibold text-3xl bg-gradient-to-r from-[#74B9FF] to-[#0be881] text-transparent bg-clip-text inline-block">
          Monkey Medium
        </h1>
      </div>
      <h2 className="mt-20 font-serif text-4xl text-center">
        {verify && verify.success ? "Verify success" : "Verify failure"}
      </h2>
      <div className="flex items-center justify-center gap-1 mt-5 text-lg font-semibold text-center">
        <p className="">{verify.message}</p>
        {verify && !verify.success && (
          <p className="">please login and try again</p>
        )}
        <NavLink to="/sign-in">
          <p className="text-blue-400 hover:text-blue-500 ">login</p>
        </NavLink>
      </div>
    </VerifySetupPasswordPageStyle>
  );
};

export default VerifySetupPasswordPage;
