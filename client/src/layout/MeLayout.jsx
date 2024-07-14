import { Col, Row } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import HomeSide from "../modules/home/HomeSide";

const MeLayout = () => {
  const location = useLocation();
  return (
    <>
      <div className="w-full border-t border-gray-300"></div>
      <Row className="px-5 ">
        <Col
          xs={24}
          md={15}
          className="flex flex-col w-full border-r border-gray-300"
        >
          <div className="max-w-[700px] w-full mx-auto my-0 mt-8 flex items-center px-5 ">
            <Outlet></Outlet>
          </div>
        </Col>
        <Col xs={0} md={9}>
          {!location?.pathname.includes("/settings") ? (
            <HomeSide></HomeSide>
          ) : (
            ""
          )}
        </Col>
      </Row>
    </>
  );
};

export default MeLayout;
