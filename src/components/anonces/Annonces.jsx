import React, { useEffect } from 'react';
import "./Annonces.css";
import images from '../../assets/images/images';
import { useState } from 'react';
import formatDate from '../formatDate/formatDate';

const Annonces = ({ data }) => {
    const [page, setPage] = useState(1);

    const [pic, setPic] = useState([images.SuitCase1, images.SuitCase1, images.Plane,images.Localisation,images.Journey]);
    const getRandomPic = () => {
        const randomIndex = Math.floor(Math.random() * pic.length);
        return pic[randomIndex];
    };
   
    const itemsPerPage = 12;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const voyagesToDisplay = data.slice(startIndex, endIndex);

    const totalPages = Math.ceil(data.length / itemsPerPage);


    return (
        <>
        <div></div>
            <div className='main-annonce-div'>
                {voyagesToDisplay.map((voyageur,index) => (
                    <div className='user-annonce' key={voyageur["_id"]["$oid"]} onClick={() => {
                        window.location.href = `/detailed-ads/${voyageur["_id"]["$oid"]}`
                    }}>
                        <div >
                            <img src={getRandomPic()} alt="Image aléatoire" className='image-annonce' />
                        </div>
                        <div className='traveling-information'>
                            <span>Salut c'est : {voyageur.nom} </span>
                            <span>Je suis à : {voyageur.villeDepart.toLocaleLowerCase()} ({(voyageur.paysDepart)}) actuellement</span>
                            <span>Je voyage le : {formatDate(voyageur.dateDepart)}</span>
                            <span>Je vais à : {voyageur.villeArrive.toLocaleLowerCase()} ({(voyageur.paysArrive)})</span>
                            <span>kilo dispo : {voyageur.kilosDispo}</span>
                            <span>prix kilo : {voyageur.prixKilo} {voyageur.currency}/{voyageur.discutable ? "non discutable" : "discutable"}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: "50px" }}>
                <button className='pagination-btn' onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Page précédente
                </button>
                <button
                    className='pagination-btn'
                    onClick={() => setPage(page + 1)}
                    disabled={endIndex >= data.length}
                >
                    Page suivante
                </button>
            </div>
            <span style={{ color: "black", textAlign: "center", display: "flex", justifyContent: "center", marginTop: "20px" }}>
                Page {page} sur {totalPages}
            </span>
        </>
    );
};

export default Annonces;
