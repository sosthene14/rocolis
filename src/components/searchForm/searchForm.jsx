import React, { useEffect, useState } from "react";
import DateDepart from "./DateDepart";
import TravelerSearchFormDepart from "./SearchDepart";
import TravelerSearchFormDestination from "./SearchDestination";
import { useRef } from "react";
import Cookies from "universal-cookie";
import { decodeToken } from "react-jwt";
import formatDate from "../formatDate/formatDate";

const SearchForm = ({ datas }) => {
  const input_depart = useRef();
  const input_destination = useRef();
  const date_depart = useRef();
  const [onErrorFieldDateDprt, setOnErrorFieldDateDprt] = useState(false);
  const [onErrorFieldDest, setOnErrorFieldDest] = useState(false);
  const [onErrorFieldDepartDest, setOnErrorFieldDepartDest] = useState(false);
  const [email, setEmail] = useState("");
  const [notificationData, setNotificationData] = useState([]);
  const cookies = new Cookies(null, { path: "/" });

  useEffect(() => {
    if (cookies.get("jwt") != undefined) {
      const decodedToken = decodeToken(cookies.get("jwt"));
      setEmail(decodedToken.email);
    }
  }, []);
  useEffect(() => {
    if (email != "") {
      getNotifications();
    }
  }, [email]);
  const getNotifications = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/get-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
  
      if (!response.ok) {
        console.error(`Error: ${response.status}`);
        // Handle the error if needed
        return;
      }
  
      const data = await response.json();
  
      if (data.response !== false) {
        setNotificationData(data.data);
      }
  
    } catch (error) {
      console.error("Error:", error);
      // Handle the error if needed
    }
  };
  
  const formSubmit = (e) => {
    let inputDepart = input_depart.current.value;
    let inputDestination = input_destination.current.value;
    let dateDepart = formatDate(date_depart.current.value);

    if (inputDepart.trim() === "") {
      setOnErrorFieldDepartDest(true);
    }
    if (inputDestination.trim() === "") {
      setOnErrorFieldDest(true);
    }
    showResult(inputDestination, inputDepart, dateDepart);
  };

  const showResult = (inputDestination, inputDepart, dateDepart) => {
    if (onErrorFieldDateDprt || onErrorFieldDest || onErrorFieldDepartDest) {
    } else {
      if (
        inputDepart.trim() !== "" &&
        inputDestination.trim() !== "" &&
        dateDepart.trim() !== ""
      ) {
        window.location.pathname = `/searched/${inputDepart.toLocaleLowerCase()}/${inputDestination.toLocaleLowerCase()}/${
          date_depart.current.value
        }`;
      } else {
      }
    }
  };

  const removeErrorDepart = () => {
    setOnErrorFieldDepartDest(false);
  };
  const removeErrorDest = () => {
    setOnErrorFieldDest(false);
  };

  const removeErrorDate = () => {
    setOnErrorFieldDateDprt(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "100px",
        marginBottom: "100px",
        gap: "50px",
      }}
    >
      <TravelerSearchFormDepart
        notificationData={notificationData}
        datas={datas}
        removeError={removeErrorDepart}
        input_depart={input_depart}
        onErrorFieldDepartDest={onErrorFieldDepartDest}
      />
      <TravelerSearchFormDestination
        notificationData={notificationData}
        datas={datas}
        removeErrorDest={removeErrorDest}
        input_destination={input_destination}
        onErrorFieldDest={onErrorFieldDest}
      />
      <DateDepart
        removeErrorDate={removeErrorDate}
        date_depart={date_depart}
        onErrorFieldDateDprt={onErrorFieldDateDprt}
      />

      <div>
        <button
          className="search-btn"
          onClick={() => {
            formSubmit();
          }}
        >
          Rechercher
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
