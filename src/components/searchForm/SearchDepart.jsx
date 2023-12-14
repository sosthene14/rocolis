import React, { useState, useEffect, useRef } from "react";
import "./searchForm.css";
import useGeoLocation from "react-ipgeolocation";
import "./searchForm.css";

const TravelerSearchFormDepart = ({
  input_depart,
  onErrorFieldDepartDest,
  removeError,
  datas,
}) => {
  const [depart, setDepart] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [canViewSuggestion, setCanViewSuggestion] = useState(false);
  const [departNotAvailable, setDepartNotAvailable] = useState(false);
  const [data, setData] = useState([]);
  const depart_suggestion = useRef(null);

  useEffect(() => {
    setData(datas);
  }, [datas]);

  const handleSearchs = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const uniqueDeparts = new Set();

    if (term.trim() === "") {
      setCanViewSuggestion(false);
      setSearchResults([]);
    } else {
      const filteredResults = data.filter((element) =>
        element.depart.toLowerCase().includes(term.toLowerCase())
      );

      filteredResults.forEach((element) => {
        uniqueDeparts.add(element.depart.toLowerCase());
      });
      setSearchResults(uniqueDeparts);
      setCanViewSuggestion(true);

      if (term.trim() !== "" && filteredResults.length === 0) {
        setDepartNotAvailable(true);
      } else {
        setDepartNotAvailable(false);
      }
    }
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (canViewSuggestion) {
          if (ref.current && !ref.current.contains(event.target)) {
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

  useOutsideAlerter(depart_suggestion);

  const handleAddDepart = (e, element_clicked) => {
    localStorage.setItem("favoriteDep", element_clicked);
    setDepart(localStorage.getItem("favoriteDep"));
  };

  const location = useGeoLocation();

  return (
    <div>
      <form id="my-form">
        <div>
          <label className="label-search">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <input
                id="input-depart"
                placeholder="Ville de départ"
                ref={input_depart}
                className={
                  onErrorFieldDepartDest ? "depart-input-error" : "depart-input"
                }
                type="text"
                value={depart}
                onChange={(e) => {
                  setDepart(e.target.value);
                  handleSearchs(e);
                }}
                onClick={removeError}
                required
              />
              <div
                ref={depart_suggestion}
                id={canViewSuggestion ? "depart-list" : "depart-list-none"}
              >
                {searchResults.size > 0 && searchTerm.trim() !== "" && (
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
