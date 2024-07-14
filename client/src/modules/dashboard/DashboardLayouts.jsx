import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import PageNotFound from "../../pages/PageNotFound";
import { useAuth } from "../../contexts/auth-context";
import DashboardHeader from "./DashboardHeader";
import Button from "../../components/button/Button";
import { icons } from "../../utils/constants";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
const DashboardStyles = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  .dashboard {
    &-heading {
      font-weight: bold;
      font-size: 25px;
      margin-bottom: 5px;
      color: ${(props) => props.theme.black};
    }
    &-short-desc {
      font-size: 14px;
      color: ${(props) => props.theme.gray80};
    }
    &-main {
      display: grid;
      grid-template-columns: 300px minmax(0, 1fr);
      padding: 20px 20px;
      gap: 0 40px;
      align-items: start;
    }
    @media screen and (max-width: 1023.98px) {
      &-heading {
        font-size: 20px;
      }
      &-main {
        grid-template-columns: 100%;
        padding: 20px;
      }
    }
  }
`;
const DashboardLayout = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate("/sign-in");
      return;
    }
    if (userInfo?.data?.role === "user") navigate("/");
  }, [navigate, userInfo]);

  const toggleVisible = debounce(() => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  }, 200);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);

    return () => window.removeEventListener("scroll", toggleVisible);
  }, [toggleVisible]);

  if (!userInfo) return <PageNotFound></PageNotFound>;

  return (
    <DashboardStyles>
      <DashboardHeader></DashboardHeader>
      <div className="dashboard-main">
        <Sidebar></Sidebar>
        <div className="dashboard-children">
          <Outlet></Outlet>
        </div>
      </div>
      <div
        className="fixed right-8 bottom-8"
        style={{ display: visible ? "inline" : "none" }}
      >
        <Button height="40px" width="40px" onClick={scrollToTop}>
          {icons.chevronUpIcon}
        </Button>
      </div>
    </DashboardStyles>
  );
};

export default DashboardLayout;
