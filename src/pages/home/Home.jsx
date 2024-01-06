import React from "react";
import { useState, useEffect } from "react";
import "./Home.css";
import SearchForm from "../../components/searchForm/SearchForm";
import FilterDropdown from "../../components/filterDropdown/FilterDropDown";
import { Footer } from "../../components/footer/Footer";
import UserIcon from "../../components/userIcon/UserIcon";
import { ThreeCircles } from "react-loader-spinner";
import Header from "./Header";
import SectionBackground from "./SectionBackground";
import SectionPlanification from "./SectionPlanification";
import SectionDepartDest from "./SectionDepartDest";
import SliderComponant from "./Slider";
import Slider2 from "./Slider2";
import handleJWT from "../../components/handleJWT/JWT";
import images from "../../assets/images/images";

function Home({ datas, notificationData }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [dataRecent, setDataRecent] = useState([]);
  const [userMail, jwtToken] = handleJWT();
  // Added loading state

  /*
  useEffect(() => {
    if (dataRecent.length > 0 && jwtToken !== "") {
      getSellerPhone(data[0].publishedBy, jwtToken);
    }
  }, [dataRecent, jwtToken]);*/

  useEffect(() => {
    setLoading(true);
    if (datas.length === 0) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setLoading(false);
    setData(datas);
  }, [datas]);
  return (
    <>
      {loading ? (
        <div className="loader-div">
          <ThreeCircles
            height="70"
            width="70"
            color="#6C63FF"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="three-circles-rotating"
            outerCircleColor=""
            innerCircleColor=""
            middleCircleColor=""
          />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            overflowX: "hidden",
          }}
        >
          <Header />
          <SectionBackground />
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div>
                <SearchForm datas={datas} notificationData={notificationData} />
              </div>
              <div>
                <SectionPlanification />
              </div>
              <div>
                <SectionDepartDest />
              </div>
              <div>
                <div>
                  <SliderComponant />
                </div>
              </div>
            </div>
          </div>
          <div>
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
