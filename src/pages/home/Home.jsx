import React from "react";
import { useState, useEffect } from "react";
import "./Home.css";
import SearchForm from "../../components/searchForm/SearchForm";
import FilterDropdown from "../../components/filterDropdown/FilterDropDown";
import { Footer } from "../../components/footer/Footer";
import UserIcon from "../../components/userIcon/UserIcon";
import { ThreeCircles } from "react-loader-spinner";

function Home({datas,notificationData}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false); // Added loading state

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
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="bg-div-image">
            <UserIcon />
            <div className="nav-items">
              <h1 className='text-4xl font-medium' style={{ color: "white", cursor: "pointer" }}>ROCOLIS</h1>
              <nav>
                <ul className="links-ul">
                  <li>
                    <a href="/" className='mylinks'>Accueil</a>
                  </li>
                  <li>
                    <a href="/destinations" className='mylinks'>Destinations</a>
                  </li>
                  <li>
                    <a href="/contacter-nous" className='mylinks'> Nous contacter </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div>
              <h1 className="slogan">
                Trouver des vendeurs de kilos plus facilement
              </h1>
            </div>
            <div>
              <SearchForm datas={datas} notificationData={notificationData} />
            </div>

            <div>
              <FilterDropdown data={data} />
            </div>
            {isError && (
              <p style={{ color: "red", textAlign: "center" }}>Il n'y a pas d'annonces disponibles</p>
            )}
            <div>
              <Footer />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
