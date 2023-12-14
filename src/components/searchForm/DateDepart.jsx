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
          className={onErrorFieldDateDprt ? "date-input-error":'date-input'}
          value={departureDate}
          onClick={removeErrorDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          required
        />
      </label></form>
    </div>
  )
}

export default DateDepart