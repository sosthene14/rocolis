import React, { useState, useEffect, useRef } from "react";
import "./searchForm.css";
import useGeoLocation from "react-ipgeolocation";

const TravelerSearchFormDestination = ({
  input_destination,
  onErrorFieldDest,
  removeErrorDest,
  datas,
}) => {
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [canViewSuggestion, setCanViewSuggestion] = useState(false);
  const [destinationNotAvailable, setDestinationNotAvailable] = useState(false);
  const destination_suggestion = useRef(null);
  const [data, setData] = useState([]);

  const handleSearchs = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const uniqueDestinations = new Set();

    if (term.trim() === "") {
      setCanViewSuggestion(false);
      setSearchResults([]);
    } else {
      const filteredResults = data.filter((element) =>
        element.destination.toLowerCase().includes(term.toLowerCase())
      );

      filteredResults.forEach((element) => {
        uniqueDestinations.add(element.destination.toLowerCase());
      });
      setSearchResults(uniqueDestinations);
      setCanViewSuggestion(true);

      if (term.trim() !== "" && filteredResults.length === 0) {
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

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchData = {
      destination,
    };
    console.log("searchData");
    return true;
  };

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
                  onErrorFieldDest ? "depart-input-error" : "depart-input"
                }
                type="text"
                value={destination}
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
                    ? "destination-list"
                    : "destination-list-none"
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
                    Il semble que cette destination ne soit pas encore
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
