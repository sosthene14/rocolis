import React from "react";
import { useState, useEffect, useRef } from "react";
import images from "../../assets/images/images";
import "./Logout.css";

function Logout({handleLogout }) {
  const [popUpVisibility, setPopUpVisibility] = useState(false);
  let optionDiv = useRef();

  useEffect(() => {
      handleLogoutState();
  },handleLogout);

  function handleLogoutState() {
    if (handleLogout && handleLogout.current.click) {
      console.log("click");
    }
  }

  function handleShowLogout() {
    console.log("click");
    setPopUpVisibility(!popUpVisibility);
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target !== undefined) {
        if (
          optionDiv.current &&
          !optionDiv.current.contains(e.target) &&
          e.target.nodeName !== "HTML" &&
          e.target.alt !== "logout"
        ) {
          setPopUpVisibility(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div
        className={
          !popUpVisibility ? "container-logout" : "container-logout-invisible"
        }
        ref={optionDiv}
      >
        <div className="message-logout">
          <p className="text-logout">Voulez vous vous déconnecter ?</p>
          <div className="button-logout">
            <button className="submit-in_btn">
              Oui
            </button>
            <div></div>
            <button className="submit-in_btn" onClick={handleShowLogout}>
              Non
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logout;
