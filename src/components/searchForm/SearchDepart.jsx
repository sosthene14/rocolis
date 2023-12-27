import React, { useState, useEffect, useRef } from "react";
import "./searchForm.css";
import useGeoLocation from "react-ipgeolocation";
import "./searchForm.css";
import Cookies from "universal-cookie";
import { useJwt, decodeToken, isExpired } from "react-jwt";

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
        element.villeDepart.toLowerCase().includes(term.toLowerCase())
      );
      const filteredResults2 = otherSuggestion.filter((element) =>
        element.villeDepart.toLowerCase().includes(term.toLowerCase())
      );

      filteredResults.forEach((element) => {
        uniqueDeparts.add(element.villeDepart.toLowerCase());
      });
      filteredResults2.forEach((element) => {
        uniqueDeparts.add(element.villeDepart.toLowerCase());
      });
      if (data.length > 0) {
        setSearchResults(uniqueDeparts);
        setCanViewSuggestion(true);
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
                id="input-villeDepart"
                placeholder="Ville de départ"
                ref={input_depart}
                className={
                  onErrorFieldDepartDest ? "w-40 text-sm rounded-lg bg-rose-100 text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none" : "w-40 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
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
              <div
                ref={depart_suggestion}
                id={canViewSuggestion ? "villeDepart-list" : "villeDepart-list-none"}
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
