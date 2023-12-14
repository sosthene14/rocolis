import React, { useState } from 'react'
import DateDepart from './DateDepart'
import TravelerSearchFormDepart from './SearchDepart'
import TravelerSearchFormDestination from './SearchDestination'
import { useRef } from 'react';


const SearchForm = ({datas}) => {
    const input_depart = useRef();
    const input_destination = useRef()
    const date_depart = useRef()
    const [onErrorFieldDateDprt, setOnErrorFieldDateDprt] = useState(false)
    const [onErrorFieldDest, setOnErrorFieldDest] = useState(false)
    const [onErrorFieldDepartDest, setOnErrorFieldDepartDest] = useState(false)


    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const formSubmit = (e) => {
        let inputDepart = input_depart.current.value
        let inputDestination = input_destination.current.value
        let dateDepart = formatDate(date_depart.current.value)

        if (inputDepart.trim() === "") {
            setOnErrorFieldDepartDest(true)
        }
        if (inputDestination.trim() === "") {
            setOnErrorFieldDest(true)
        }
        if (date_depart.current.value === "") {
            setOnErrorFieldDateDprt(true)
        }
        showResult(inputDestination,inputDepart,dateDepart)
    }


    const showResult = (inputDestination,inputDepart,dateDepart) =>{
        if (onErrorFieldDateDprt || onErrorFieldDest || onErrorFieldDepartDest){
        }
        else{
            if (inputDepart.trim() !== "" && inputDestination.trim() !== "" && dateDepart.trim() !== ""){
                window.location.pathname = `/searched/${inputDepart}/${inputDestination}/${date_depart.current.value}`;            }
            else{
            }
        }
    }

    const removeErrorDepart = () => {
        setOnErrorFieldDepartDest(false)
    }
    const removeErrorDest = () => {
        setOnErrorFieldDest(false)
    }

    const removeErrorDate = () => {
        setOnErrorFieldDateDprt(false)
    }


    return (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", marginTop: "100px",marginBottom: "100px", gap: "50px" }}>
            <TravelerSearchFormDepart datas={datas} removeError={removeErrorDepart} input_depart={input_depart} onErrorFieldDepartDest={onErrorFieldDepartDest} />
            <TravelerSearchFormDestination datas={datas} removeErrorDest={removeErrorDest} input_destination={input_destination} onErrorFieldDest={onErrorFieldDest} />
            <DateDepart removeErrorDate={removeErrorDate} date_depart={date_depart} onErrorFieldDateDprt={onErrorFieldDateDprt} />

            <div>
                <button className='search-btn' onClick={() => {
                    formSubmit()
                }} >
                    Rechercher
                </button>
            </div>
        </div>
    )
}

export default SearchForm 