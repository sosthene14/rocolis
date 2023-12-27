import React, { useState, useEffect, useRef } from "react";
import { FakeFooter } from "../../components/fakeFooter/FakeFooter";
import "./ManageNotification.css";
import ManageNotificationForm from "./ManageNotificationForm";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import RenderNotification from "./renderNotification";
import EditNotification from "./EditNotification";
import NavBar from "../../components/navBar/NavBar";
import Cookies from "universal-cookie";
import { ThreeCircles } from "react-loader-spinner";
uuidv4();

function ManageNotification({ email }) {
  const [notifications, setNotifications] = useState([]);
  const cookies = new Cookies(null, { path: "/" });

  const [loader, setLoader] = useState(false);
  const [erreur, setErreur] = useState(false);
  const mySet = new Set();
  const [emptyNotification, setEmptyNotification] = useState(false);
  const [seeAddNotification, setSeeAddNotification] = useState(true);
  const addNotifications = (
    villeDepart,
    villeArrive,
    dateDepart,
    dateArrivee,
    indexOfDepartCountry,
    indexOfArriveCountry,
    countryDepartName,
    countryArriveName,
    indexOfDepartState,
    indexOfArriveState,
    indexOfDepartCity,
    indexOfArriveCity
  ) => {
    if (checkIfDataExist(villeDepart, villeArrive, dateDepart, dateArrivee,countryDepartName,countryArriveName)) {
      alert("Voyage déja existant");
    } else {
      setNotifications([
        ...notifications,
        {
          id: uuidv4(),
          villeDepart: villeDepart,
          villeArrive: villeArrive,
          dateDepart: dateDepart,
          dateArrivee: dateArrivee,
          disabled: true,
          indexOfDepartCountry: indexOfDepartCountry,
          indexOfArriveCountry: indexOfArriveCountry,
          countryDepartName: countryDepartName,
          countryArriveName: countryArriveName,
          indexOfDepartState: indexOfDepartState,
          indexOfArriveState: indexOfArriveState,
          indexOfDepartCity: indexOfDepartCity,
          indexOfArriveCity: indexOfArriveCity,
        },
      ]);
    }
  };

  useEffect(() => {
    if (email != "") {
      getNotifications();
    }
  }, [email]);
  const getNotifications = () => {
    setLoader(true);
    if (email) {
    }
    fetch("http://192.168.1.10:5000/api/get-notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setNotifications(data["data"]);
          setLoader(false);
        });
      } else {
        console.log("error");
        setLoader(false);
        setErreur(true);
      }
    });
  };

  const addNotificationsToDb = (email) => {
    fetch("http://192.168.1.10:5000/api/add-notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        notifications: notifications,
      }),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {});
      }
    });
  };
  useEffect(() => {
    if (notifications?.length > 0) {
      if (email != "") {
        setEmptyNotification(false);
        addNotificationsToDb(email);
      }
    } else {
      if (email != "") {
        setEmptyNotification(true);
      }
    }
  }, [notifications, email]);
  const checkIfDataExist = (
    villeDepart,
    villeArrive,
    dateArrivee,
    dateDepart,
    countryDepartName,
    countryArriveName
  ) => {
    let results = _.filter(notifications, (voyage) => {
      return (
        voyage.villeDepart.toLocaleLowerCase() === villeDepart.toLocaleLowerCase() &&
        (dateDepart === undefined || voyage.dateDepart === dateDepart) &&
        (dateArrivee === undefined || voyage.dateArrivee === dateArrivee) &&
        voyage.villeArrive.toLocaleLowerCase() === villeArrive.toLocaleLowerCase()
        && (voyage.countryDepartName.toLocaleLowerCase() === countryDepartName.toLocaleLowerCase())
        && (voyage.countryArriveName.toLocaleLowerCase() === countryArriveName.toLocaleLowerCase())
      );
    });
    if (results.length === 0) {
      return false;
    } else {
      return true;
    }
  };

  const sendDeleteRequest = (id) => {
    setLoader(true);
    if (email !== "") {
      fetch("http://192.168.1.10:5000/api/delete-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          id: id,
        }),
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            if (data["response"] === true) {
              setLoader(false);
              deleteNotification(id);
            } else {
              setLoader(false);
              alert("Une erreur est survenue");
            }
          });
        }
      });
    }
  };

  const deleteNotification = (id) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter(
        (notification) => notification.id !== id
      );
      if (updatedNotifications.length === 0) {
        return [];
      }
      return updatedNotifications;
    });
  };
  function checkMySet() {
    if (mySet.size > 0) {
      setSeeAddNotification(false);
    } else {
      setSeeAddNotification(true);
    }
  }
  useEffect(() => {
    notifications.map((notification) => {
      if (!notification.disabled) {
        mySet.add(notification.id);
      }
      checkMySet();
      return notification;
    });
  }, [notifications]);

  const editNotification = (id) => {
    setNotifications(
      notifications.map((notification) => {
        if (notification.id === id) {
          return {
            ...notification,
            disabled: !notification.disabled,
          };
        }
        return notification;
      })
    );
  };
  const editSavedNotification = (
    villeDepart,
    villeArrive,
    dateDepart,
    dateArrivee,
    indexOfDepartCountry,
    indexOfArriveCountry,
    countryDepartName,
    countryArriveName,
    indexOfDepartState,
    indexOfArriveState,
    indexOfDepartCity,
    indexOfArriveCity,
    id
  ) => {
    setNotifications(
      notifications.map((notification) => {
        if (notification.id === id) {
          return {
            ...notification,
            disabled: !notification.disabled,
            villeDepart: villeDepart,
            villeArrive: villeArrive,
            dateDepart: dateDepart,
            dateArrivee: dateArrivee,
            indexOfDepartCountry: indexOfDepartCountry,
            indexOfArriveCountry: indexOfArriveCountry,
            countryDepartName: countryDepartName,
            countryArriveName: countryArriveName,
            indexOfDepartState: indexOfDepartState,
            indexOfArriveState: indexOfArriveState,
            indexOfDepartCity: indexOfDepartCity,
            indexOfArriveCity: indexOfArriveCity,
          };
        }
        mySet.delete(id);
        return notification;
      })
    );
  };

  const annulateModification = (id) => {
    setNotifications(
      notifications.map((notification) => {
        if (notification.id === id) {
          return {
            ...notification,
            disabled: !notification.disabled,
          };
        }
        mySet.delete(id);
        return notification;
      })
    );
  }

  return (
    <div>
      <NavBar />
      <h1 className="detailed-ads-text" style={{ marginTop: "40px" }}>
        Centre de notifications
      </h1>
      <p className="p-notifications">
        Ici, vous pouvez personnaliser les notifications que vous souhaitez
        recevoir. Des mails vous seront envoyés lorsque des annonces
        correspondant à vos notifications seront disponibles.
      </p>
      <br />
      <br />
      {!seeAddNotification ? null : (
        <ManageNotificationForm addNotifications={addNotifications} />
      )}
      <h2
        style={{ textAlign: "center", marginBottom: "20px" }}
        className="p-notifications"
      >
        Anciennes notifications
      </h2>

      {loader ? (
        <div className="loader-div">
          <ThreeCircles
            height="70"
            width="70"
            color="#6C63FF"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="three-circles-rotating"
            outerCircleColor=""
            innerCircleColor=""
            middleCircleColor=""
          />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {notifications?.map((notification, index) =>
            !notification.disabled ? (
              <div key={index}>
                <EditNotification
                  villeDepart={notification.villeDepart}
                  villeArrive={notification.villeArrive}
                  dateDepart={notification.dateDepart}
                  dateArrivee={notification.dateArrivee}
                  indexOfDepartCountry={notification.indexOfDepartCountry}
                  countryArriveName={notification.countryArriveName}
                  countryDepartName={notification.countryDepartName}
                  indexOfArriveCountry={notification.indexOfArriveCountry}
                  indexOfDepartState={notification.indexOfDepartState}
                  indexOfArriveState={notification.indexOfArriveState}
                  indexOfDepartCity={notification.indexOfDepartCity}
                  indexOfArriveCity={notification.indexOfArriveCity}
                  id={notification.id}
                  editNotifications={editSavedNotification}
                  annulateModification={annulateModification}
                />
              </div>
            ) : (
              <RenderNotification
                key={index}
                disabled={notification.disabled}
                villeDepart={notification.villeDepart}
                id={notification.id}
                villeArrive={notification.villeArrive}
                dateDepart={notification.dateDepart}
                countryDepartName={notification.countryDepartName}
                countryArriveName={notification.countryArriveName}
                dateArrivee={notification.dateArrivee}
                deleteNotification={sendDeleteRequest}
                editNotification={editNotification}
              />
            )
          )}
        </div>
      )}
      <div>
        {emptyNotification ? (
          <div>
            <p style={{ color: "red", fontSize: "14px", textAlign: "center" }}>
              Aucune notification à afficher
            </p>
          </div>
        ) : null}
        {erreur ? (
          <p style={{ color: "red", textAlign: "center" }}>
            Une erreur est survenue
          </p>
        ) : null}
      </div>

      <FakeFooter />
    </div>
  );
}

export default ManageNotification;
