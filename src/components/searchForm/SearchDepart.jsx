import React, { useState, useEffect, useRef } from "react";
import "./searchForm.css";
import useGeoLocation from "react-ipgeolocation";
import "./searchForm.css";
import Cookies from "universal-cookie";
import { useJwt, decodeToken, isExpired } from "react-jwt";
import { FaChevronDown } from "react-icons/fa";

const TravelerSearchFormDepart = ({
  input_depart,
  onErrorFieldDepartDest,
  removeError,
  datas,
  notificationData,
}) => {
  const [villeDepart, setDepart] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [canViewSuggestion, setCanViewSuggestion] = useState(false);
  const [departNotAvailable, setDepartNotAvailable] = useState(false);
  const [data, setData] = useState([]);
  const depart_suggestion = useRef(null);
  const cookies = new Cookies(null, { path: "/" });
  const [email, setEmail] = useState("");
  const [otherSuggestion, setOtherSuggestion] = useState([]);

  useEffect(() => {
    setData(datas);
    console.log(datas);
  }, [datas]);

  useEffect(() => {
    if (cookies.get("jwt") != undefined) {
      const decodedToken = decodeToken(cookies.get("jwt"));
      setEmail(decodedToken.email);
    }
  }, []);
  function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  useEffect(() => {
    if (notificationData?.length > 0) {
      setOtherSuggestion(notificationData);
    }
  }, [email, notificationData]);

  const handleSearchs = (e) => {
    const term = removeAccents(e.target.value.trim());
    setSearchTerm(term);
    const uniqueDeparts = new Set();

    if (term.trim() === "") {
      setCanViewSuggestion(false);
      setSearchResults([]);
    } else {
      const filteredResults = data.filter((element) =>
        removeAccents(element.villeDepart.toLowerCase()).includes(term.toLowerCase())
      );
      const filteredResults2 = otherSuggestion.filter((element) =>
        removeAccents(element.villeDepart.toLowerCase()).includes(term.toLowerCase())
      );

      filteredResults.forEach((element) => {
        removeAccents(uniqueDeparts.add(element.villeDepart.toLowerCase()));
      });
      filteredResults2.forEach((element) => {
        removeAccents(uniqueDeparts.add(element.villeDepart.toLowerCase()));
      });
      if (data.length > 0 || otherSuggestion.length > 0) {
        setSearchResults(uniqueDeparts);
        setCanViewSuggestion(true);
      }
      else {
        setDepartNotAvailable(true);
      }

      if (
        term.trim() !== "" &&
        filteredResults.length === 0 &&
        filteredResults2.length === 0
      ) {
        setDepartNotAvailable(true);
      } else {
        setDepartNotAvailable(false);
      }
    }
  };

  const handleSearchWithoutTap = () => {
    const uniqueDeparts = new Set();
    const filteredResults = data.filter((element) =>
      element.villeDepart.toLowerCase()
    );
    const filteredResults2 = otherSuggestion.filter((element) =>
      element.villeDepart.toLowerCase()
    );
    filteredResults.forEach((element) => {
      uniqueDeparts.add(element.villeDepart.toLowerCase());
    });
    filteredResults2.forEach((element) => {
      uniqueDeparts.add(element.villeDepart.toLowerCase());
    });
    setSearchResults(uniqueDeparts);
  };

  useEffect(() => {
    handleSearchWithoutTap();
  }, [data, otherSuggestion]);
  const chevron = useRef(null);

  const openSuggestionView = () => {
    handleSearchWithoutTap();
    setCanViewSuggestion(true);
  };

  const closeSuggestionView = () => {
    setCanViewSuggestion(false);
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (canViewSuggestion) {
          if (ref.current && !ref.current.contains(event.target) && event.target.id !== "chevron") {
            setCanViewSuggestion(false);
          }
        }
      }
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, canViewSuggestion]);
  }

  useOutsideAlerter(depart_suggestion, chevron);

  const handleAddDepart = (e, element_clicked) => {
    localStorage.setItem("favoriteDep", element_clicked);
    setDepart(localStorage.getItem("favoriteDep"));
    setCanViewSuggestion(false);
  };

  const location = useGeoLocation();

  return (
    <div>
      <form id="my-form">
        <div>
          <label className="label-search">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="relative flex items-center">
                <input
                  ref={input_depart}
                  className={
                    onErrorFieldDepartDest
                      ? "border-2  transition-all transition-duration: 75ms border-red-400 outline-none p-3 rounded-md text-zinc-900 text-opacity-60 text-sm font-normal font-['Montserrat']"
                      : "border-2 transition-all transition-duration: 75ms outline-none border-gray-300 p-3 rounded-md text-zinc-900 text-opacity-60 text-sm font-normal font-['Montserrat']"
                  }
                  type="text"
                  value={villeDepart}
                  onChange={(e) => {
                    setDepart(e.target.value);
                    handleSearchs(e);
                  }}
                  onClick={removeError}
                  required
                />
                <label
                  style={{ color: "black", fontSize: "14px" }}
                  htmlFor="floating_outlined"
                  className="absolute text-neutral-900 text-sm dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Ville de départ
                </label>
                <FaChevronDown
                id="chevron"
                  refX={chevron}
                  refY={chevron}
                  onClick={
                    canViewSuggestion ? closeSuggestionView : openSuggestionView
                  }
                  style={{
                    position: "absolute",
                    right: "10px",
                    width: "15px",
                    height: "15px",
                    cursor: "pointer",
                  }}
                />
              </div>
              <div
                ref={depart_suggestion}
                id={
                  canViewSuggestion
                    ? "villeDepart-list"
                    : "villeDepart-list-none"
                }
              >
                {searchResults.size > 0 && (
                  <ul>
                    {Array.from(searchResults).map((result) => (
                      <li
                        key={result}
                        style={{ listStyle: "none" }}
                        onClick={() => {
                          handleAddDepart(input_depart, result);
                        }}
                      >
                        {result}
                      </li>
                    ))}
                  </ul>
                )}
                {departNotAvailable && (
                  <p style={{ color: "red" }}>
                    Il semble que cette ville de départ ne soit pas encore
                    disponible.
                  </p>
                )}
              </div>
            </div>
          </label>
        </div>
        <div></div>
      </form>
    </div>
  );
};

export default TravelerSearchFormDepart;
