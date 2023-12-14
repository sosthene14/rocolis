import React from 'react';
import "./Annonces.css";
import images from '../../assets/images/images';
import { useState } from 'react';

const Annonces = ({ data }) => {
    const [page, setPage] = useState(1);

    const [pic, setPic] = useState([images.suitcase, images.travel, images.travel2]);
    const getRandomPic = () => {
        const randomIndex = Math.floor(Math.random() * pic.length);
        return pic[randomIndex];
    };
    const itemsPerPage = 12;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const voyagesToDisplay = data.slice(startIndex, endIndex);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
      };

    return (
        <>
            <div className='main-annonce-div'>
                {voyagesToDisplay.map((voyageur) => (
                    <div className='user-annonce' key={voyageur._id} onClick={() => {
                        window.location.href = `/detailed-ads/${voyageur._id}`
                    }}>
                        <div >
                            <img src={getRandomPic()} alt="Image aléatoire" className='image-annonce' />
                        </div>
                        <div className='traveling-information'>
                            <span>Salut c'est : <strong>{voyageur.nom}</strong> </span>
                            <span>Je suis à : <strong>{voyageur.depart}</strong> actuellement</span>
                            <span>Je voyage le : <strong>{formatDate(voyageur.dateVoyage)}</strong></span>
                            <span>Je vais à : <strong>{voyageur.destination}</strong></span>
                            <span>kilo dispo : <strong>{voyageur.kilosDispo}</strong></span>
                            <span>prix kilo : <strong>{voyageur.prixKilo}</strong> FCFA/{voyageur.discutable ? "non discutable" : "discutable"}</span>
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
