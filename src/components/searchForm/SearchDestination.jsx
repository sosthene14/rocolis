import React, { useState, useEffect, useRef } from "react";
import "./searchForm.css";
import useGeoLocation from "react-ipgeolocation";
import Cookies from "universal-cookie";
import { useJwt, decodeToken, isExpired } from "react-jwt";
import currencySymbol from 'currency-symbol';

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
  console.log()
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
  }, [email, notificationData,otherSuggestion]);



  const handleSearchs = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const uniqueDestinations = new Set();

    if (term.trim() === "") {
      setCanViewSuggestion(false);
      setSearchResults([]);
    } else {
      const filteredResults = data.filter((element) =>
        element.villeArrive.toLowerCase().includes(term.toLowerCase())
      );
     
      const filteredResults2 = otherSuggestion.filter((element) =>
        element.villeArrive.toLowerCase().includes(term.toLowerCase())
      );

      filteredResults.forEach((element) => {
        uniqueDestinations.add(element.villeArrive.toLowerCase());
      });

      filteredResults2.forEach((element) => {
        uniqueDestinations.add(element.villeArrive.toLowerCase());
      });
      if (data.length > 0) {
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
  useEffect(() => {
    setData(datas);
  }, [datas]);
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (canViewSuggestion) {
          if (ref.current && !ref.current.contains(event.target)) {
            setCanViewSuggestion(false);
          }
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);

      // Unbind the event listener on clean up
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
              <input
                placeholder="Ville d'arrivé"
                id="input-dest"
                ref={input_destination}
                className={
                  onErrorFieldDest ? "villeDepart-input-error" : "villeDepart-input"
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
              <div
                ref={destination_suggestion}
                id={
                  canViewSuggestion
                    ? "villeArrive-list"
                    : "villeArrive-list-none"
                }
              >
                {searchResults.size > 0 && searchTerm.trim() !== "" && (
                  <ul>
                    {Array.from(searchResults).map((result) => (
                      <li
                        key={result}
                        style={{ listStyle: "none" }}
                        onClick={() => {
                          handleAddDestination(input_destination, result);
                        }}
                      >
                        {result}
                      </li>
                    ))}
                  </ul>
                )}
                {destinationNotAvailable && (
                  <p style={{ color: "red" }}>
                    Il semble que cette villeArrive ne soit pas encore
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
