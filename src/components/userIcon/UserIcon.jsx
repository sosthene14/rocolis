import React, { useState, useRef, useEffect } from "react";
import "./UserIcon.css";
import images from "../../assets/images/images";
import Cookies from "universal-cookie";
import { decodeToken } from "react-jwt";
import { method } from "lodash";

const UserIcon = () => {
  const notificatiion_container = useRef(null);
  const icon = useRef(null);
  const [canMaskNotifications, setCanMaskNotifications] = useState(false);
  const cookies = new Cookies(null, { path: "/" });
  const [responseData, setResponseData] = useState(null);
  const [email, setEmail] = useState("");
  const [data, setData] = useState([]);
  const [seeNewNotifications, setSeeNewNotifications] = useState(false);
  const [retire, setRetire] = useState(0);

  useEffect(() => {
    try {
      if (cookies.get("jwt")) {
        const getCockie = cookies.get("jwt");
        const decodedToken = decodeToken(getCockie);
        setEmail(decodedToken.email);
      }
    } catch (error) {
      cookies.remove("jwt");
      console.error(
        "Une erreur s'est produite lors de la gestion des cookies:",
        error
      );
    }
  }, [email]);

  const handleViewBy = async (id) => {
      try {
        const response = await fetch(
          "http://192.168.1.10:5000/api/add-email-to-seen",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              _id:id
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la requête.");
        }
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des notifications:",
          error
        );
      }
    
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://192.168.1.10:5000/api/check-notifications"
        );
        const data = await response.json();
        console.log(data);
        setResponseData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://192.168.1.10:5000/api/get-notifications-with-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la requête.");
        }
        const data = await response.json();
        setData(data.data);
        console.log(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des notifications:",
          error
        );
      }
    };
    if (email != "") {
      fetchData();
    }
  }, [email]);

  function useOutsideAlerter(ref, clickref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (canMaskNotifications) {
          if (
            (ref.current && !ref.current.contains(event.target)) ||
            clickref.current.contains(event.target)
          ) {
            setSeeNewNotifications(false);
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
    <div style={{ marginBottom: "20px", display: "flex" }}>
      <div>
        <a style={{ color: "white" }} href="/publier">
          <button className="btn-publish">Publier</button>
        </a>
      </div>

      <div onClick={() => setRetire(data.length)}>
        <span className="notification-number">{data.length - retire}</span>
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
            <p
              style={{ textAlign: "center", marginTop: "5px" }}
              onClick={() => setSeeNewNotifications(!seeNewNotifications)}
            >
              <a>
                Vous avez {data.length}{" "}
                {data.length < 1
                  ? "nouvelle notification"
                  : "nouvelles notifications"}
              </a>
            </p>
          </div>
          {seeNewNotifications ? (
            <div
              className="absolute text-center w-72 m-auto right-0  py-5 rounded-xl"
              style={{ backgroundColor: " rgb(230, 230, 230)" }}
            >
              {data.map((notification, index) => (
                <p className="mb-1" key={index} onClick={() => handleViewBy(notification.id)}>
                  <a href={`/searched/${notification.villeDepart}/${notification.villeArrive}`}>{notification.villeDepart} ({notification.paysDepart}) - {notification.villeArrive} ({notification.paysArrive})</a>
                </p>
              ))}
            </div>
          ) : null}

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
              <a onClick={handleLogout}>Deconnexion</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserIcon;
