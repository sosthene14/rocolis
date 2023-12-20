import React, { useEffect } from "react";
import "./ManageNotification.css";
import images from "../../assets/images/images";
import { useState } from "react";
const RenderNotification = ({
  villeDepart,
  id,
  villeArrive,
  dateArrivee,
  dateDepart,
  disabled,
  deleteNotification,
  editNotification,
  countryDepartName,
  countryArriveName,
}) => {
  const myArray = [];
  const mySet = new Set();
  const [addNotifications, setAddNotifications] = useState([]);
  const handleAddNotificationTrue = (notificationId) => {
    setAddNotifications((prevNotifications) => [
      ...prevNotifications,
      notificationId,
    ]);
    mySet.add(notificationId);
  };

  return (
    <div className="max-w-sm">
      <div
        className="render-notification max-w-sm w-30 rounded-xl mx-auto"
        style={{
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          gap: "20px",
          margin: "auto",
        }}
      >
        <div className="flex flex-col gap-5">
          <div>
            <input
              type="text"
              disabled={disabled}
              value={villeDepart +" (" + countryDepartName + ")"|| ""}
              className="shadow-md w-30 sm:w-30 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
            />
          </div>
          <img
            src={images.Arrow}
            className="icon-manage-notifications rotate-90 mx-auto"
          />
          <div>
            <input
              type="text"
              disabled={disabled}
              value={villeArrive +" (" + countryArriveName + ")" || ""}
              className="shadow-md w-30 sm:w-30 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
            />
          </div>
          <div>
            <img
              src={images.Trash}
              onClick={() => {
                deleteNotification(id);
              }}
              className="icon-manage-notifications mx-auto"
            />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <input
              type="date"
              disabled={disabled}
              value={dateDepart || ""}
              className="shadow-md w-30 sm:w-30 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
            />
          </div>
          <img
            src={images.Arrow}
            className="icon-manage-notifications rotate-90 mx-auto"
          />
          <div>
            <input
              type="date"
              disabled={disabled}
              value={dateArrivee || ""}
              className="shadow-md w-30 sm:w-30 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
            />
          </div>
          <div>
            <img
              src={images.Edit}
              className="icon-manage-notifications mx-auto "
              onClick={() => {
                editNotification(id);
                handleAddNotificationTrue(id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderNotification;
