import React, { useState, useEffect, useRef } from "react";
import "./searchForm.css";
import useGeoLocation from "react-ipgeolocation";
import Cookies from "universal-cookie";
import { useJwt, decodeToken, isExpired } from "react-jwt";
import currencySymbol from "currency-symbol";
import { FaChevronDown } from "react-icons/fa";

const TravelerSearchFormDestination = ({
  input_destination,
  onErrorFieldDest,
  removeErrorDest,
  datas,
  notificationData,
}) => {
  const [villeArrive, setDestination] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [canViewSuggestion, setCanViewSuggestion] = useState(false);
  const [destinationNotAvailable, setDestinationNotAvailable] = useState(false);
  const destination_suggestion = useRef(null);
  const [data, setData] = useState([]);
  const depart_suggestion = useRef(null);
  const cookies = new Cookies(null, { path: "/" });
  const [email, setEmail] = useState("");
  const [otherSuggestion, setOtherSuggestion] = useState([]);
  console.log();
  useEffect(() => {
    if (cookies.get("jwt") != undefined) {
      const decodedToken = decodeToken(cookies.get("jwt"));
      setEmail(decodedToken.email);
    }
  }, []);
  useEffect(() => {
    if (notificationData?.length > 0) {
      setOtherSuggestion(notificationData);
    }
  }, [email, notificationData, otherSuggestion]);

  function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const handleSearchs = (e) => {
    const term = removeAccents(e.target.value.trim());
    setSearchTerm(term);
    const uniqueDestinations = new Set();

    if (term.trim() === "") {
      setCanViewSuggestion(false);
      setSearchResults([]);
    } else {
      const filteredResults = data.filter((element) =>
        removeAccents(element.villeArrive.toLowerCase()).includes(
          term.toLowerCase()
        )
      );

      const filteredResults2 = otherSuggestion.filter((element) =>
        removeAccents(element.villeArrive.toLowerCase()).includes(
          term.toLowerCase()
        )
      );

      filteredResults.forEach((element) => {
        uniqueDestinations.add(
          removeAccents(element.villeArrive.toLowerCase())
        );
      });

      filteredResults2.forEach((element) => {
        uniqueDestinations.add(
          removeAccents(element.villeArrive.toLowerCase())
        );
      });
      if (data.length > 0 || otherSuggestion.length > 0) {
        setSearchResults(uniqueDestinations);
        setCanViewSuggestion(true);
      }

      if (
        term.trim() !== "" &&
        filteredResults.length === 0 &&
        filteredResults2.length === 0
      ) {
        setDestinationNotAvailable(true);
      } else {
        setDestinationNotAvailable(false);
      }
    }
  };
  
  const handleSearchWithoutTap = () => {
    const uniqueDeparts = new Set();
    const filteredResults = data.filter((element) =>
      element.villeArrive.toLowerCase()
    );
    const filteredResults2 = otherSuggestion.filter((element) =>
      element.villeArrive.toLowerCase()
    );
    filteredResults.forEach((element) => {
      uniqueDeparts.add(element.villeArrive.toLowerCase());
    });
    filteredResults2.forEach((element) => {
      uniqueDeparts.add(element.villeArrive.toLowerCase());
    });
    setSearchResults(uniqueDeparts);
  };
  const openSuggestionView = () => {
    handleSearchWithoutTap();
    setCanViewSuggestion(true);
  };

  const closeSuggestionView = () => {
    setCanViewSuggestion(false);
  };

  useEffect(() => {
    handleSearchWithoutTap();
  }, [data, otherSuggestion]);
  useEffect(() => {
    setData(datas);
  }, [datas]);
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

  useOutsideAlerter(destination_suggestion);

  const handleAddDestination = (e, element_clicked) => {
    localStorage.setItem("favoriteDes", element_clicked);
    setDestination(localStorage.getItem("favoriteDes"));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchData = {
      villeArrive,
    };
    console.log("searchData");
    return true;
  };
  const price = 50;
  const formattedPrice = `$${price}`;

  // Then in your JSX:

  const location = useGeoLocation();

  return (
    <>
      <form id="my-form">
        <div>
          <label className="label-search">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="relative flex items-center">
                <input
                  ref={input_destination}
                  className={
                    onErrorFieldDest
                      ? "border-2 transition-all transition-duration: 75ms border-red-400 outline-none p-3 rounded-md text-zinc-900 text-opacity-60 text-sm font-normal font-['Montserrat']"
                      : "border-2 transition-all transition-duration: 75ms outline-none border-gray-300 p-3 rounded-md text-zinc-900 text-opacity-60 text-sm font-normal font-['Montserrat']"
                  }
                  type="text"
                  value={villeArrive}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    handleSearchs(e);
                  }}
                  onClick={removeErrorDest}
                  required
                />
                <label
                  style={{ color: "black", fontSize: "14px" }}
                  htmlFor="floating_outlined"
                  className="absolute text-neutral-900 text-sm dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Ville d'arrivée
                </label>
                <FaChevronDown
                id="chevron"
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
                ref={destination_suggestion}
                id={
                  canViewSuggestion
                    ? "villeArrive-list"
                    : "villeArrive-list-none"
                }
              >
                {searchResults.size > 0 && (
                  <ul>
                    {Array.from(searchResults).map((result) => (
                      <li
                        key={result}
                        style={{ listStyle: "none" }}
                        onClick={() => {
                          handleAddDestination(input_destination, result);
                          setCanViewSuggestion(false);
                        }}
                      >
                        {result}
                      </li>
                    ))}
                  </ul>
                )}
                {destinationNotAvailable && (
                  <p style={{ color: "red" }}>
                    Il semble que cette ville d'arrivée ne soit pas encore
                    disponible.
                  </p>
                )}
              </div>
            </div>
          </label>
        </div>
      </form>
    </>
  );
};

export default TravelerSearchFormDestination;
