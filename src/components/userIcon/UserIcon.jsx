import React, { useState, useRef, useEffect } from "react";
import "./UserIcon.css";
import images from "../../assets/images/images";
import Cookies from "universal-cookie";

const UserIcon = () => {
  const notificatiion_container = useRef(null);
  const icon = useRef(null);
  const [canMaskNotifications, setCanMaskNotifications] = useState(false);
  const cookies = new Cookies(null, { path: "/" });

  function useOutsideAlerter(ref, clickref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (canMaskNotifications) {
          if (
            (ref.current && !ref.current.contains(event.target)) ||
            clickref.current.contains(event.target)
          ) {
            setCanMaskNotifications(false);
          }
        } else if (!canMaskNotifications) {
          if (clickref.current.contains(event.target)) {
            setCanMaskNotifications(true);
          }
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, canMaskNotifications]);
  }
  const handleLogout = () => {
    cookies.remove("jwt");
    if (!cookies.get("jwt")) {
      window.location.href = "/signin";
    }
  };
  useOutsideAlerter(notificatiion_container, icon);
  return (
    <div style={{marginBottom:"20px",display:"flex"}}>
      <div>
        <button className="btn-publish"><a style={{color:"white"}} href="/publier">Publier</a></button>
      </div>

      <div>
        <span className="notification-number">12</span>
        <div>
          <img src={images.userIcon} className="user-icon" ref={icon} />
        </div>
        <div
          className={
            canMaskNotifications
              ? "main-container-user-icon"
              : "main-container-user-icon-none"
          }
          ref={notificatiion_container}
        >
          <div>
            <p style={{ textAlign: "center", marginTop: "5px" }}>
              <a href="#">Vous avez 12 nouvelles notifications</a>
            </p>
          </div>
          <div>
          <div className="notification-pannel">
            <img src={images.Cloche} />
            <p>
              <a href="/manage-notifications">Gérer les notifications</a>
            </p>
          </div>
          </div>
          <div className="notification-pannel">
            <img src={images.MesAnnonces} />
            <p>
              <a href="/your-ads">Mes Annonces</a>
            </p>
          </div>
          <div className="notification-pannel">
            <img src={images.VueEnsemble} />
            <p>
              <a href="/vue-d-ensemble">Vue d'ensemble</a>
            </p>
          </div>
          <div className="notification-pannel">
            <img src={images.Deconnexion} />
            <p>
              <a onClick={handleLogout}>
                Deconnexion
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserIcon;
