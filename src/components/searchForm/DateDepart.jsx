import React from "react";
import "./searchForm.css";
import { useState } from "react";

const DateDepart = ({ date_depart, onErrorFieldDateDprt, removeErrorDate }) => {
  const [departureDate, setDepartureDate] = useState("");

  return (
    <div>
      <form id="my-form">
        <div className="relative flex items-center">
          <input
            ref={date_depart}
            type="date"
            className="border-2 outline-none border-gray-300 p-3 rounded-md text-zinc-900 text-opacity-60 text-sm font-normal font-['Montserrat']"
            value={departureDate}
            onClick={removeErrorDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            placeholder="Date de depart"
          />
            <label
                style={{color:"black", fontSize:"14px"}}
                  htmlFor="floating_outlined"
                  className="absolute text-neutral-900 text-sm dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Date départ
                </label>
        </div>
      </form>
    </div>
  );
};

export default DateDepart;
