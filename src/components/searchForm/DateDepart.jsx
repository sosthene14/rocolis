import React from 'react'
import "./searchForm.css"
import { useState } from 'react';

const DateDepart = ({ date_depart,onErrorFieldDateDprt,removeErrorDate }) => {
  const [departureDate, setDepartureDate] = useState('');

  return (
    <div><form id='my-form'>
      <label className='label-search'>
        <input
          ref={date_depart}
          type="date"
          className="w-40 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
          value={departureDate}
          onClick={removeErrorDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        placeholder='Date de depart'
        />
      </label></form>
    </div>
  )
}

export default DateDepart