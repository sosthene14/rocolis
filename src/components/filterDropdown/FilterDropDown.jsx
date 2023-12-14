import React, { useState } from 'react';
import "./FilterDropDown.css"
import Annonces from '../anonces/Annonces';
const FilterDropdown = ({ data }) => {
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
  };
  const sortByPriceHighToLow = (a, b) => b.prixKilo - a.prixKilo;
  const sortByPriceLowToHigh = (a, b) => a.prixKilo - b.prixKilo;
  const sortByDateRecentToOld = (a, b) => new Date(b.dateVoyage) - new Date(a.dateVoyage);
  const sortByDateOldToRecent = (a, b) => new Date(a.dateVoyage) - new Date(b.dateVoyage);
  const sortByKilosAvailable = (a, b) => b.kilosDispo - a.kilosDispo;

  const sortData = (filter) => {
    switch (filter) {
      case 'priceHighToLow':
        return data.sort(sortByPriceHighToLow);
      case 'priceLowToHigh':
        return data.sort(sortByPriceLowToHigh);
      case 'dateRecentToOld':
        return data.sort(sortByDateRecentToOld);
      case 'dateOldToRecent':
        return data.sort(sortByDateOldToRecent);
      case 'kilosAvailable':
        return data.sort(sortByKilosAvailable);
      default:
        return data;
    }
  };

  const sortedData = sortData(selectedFilter);

  return (
    <>
      <div className='filter-div'>
        <label htmlFor="filterDropdown"></label>
        <select id="filterDropdown" value={selectedFilter} onChange={handleFilterChange}>
          <option value="priceHighToLow">Prix (du plus haut au plus bas)</option>
          <option value="priceLowToHigh">Prix (du plus bas au plus haut)</option>
          <option value="dateRecentToOld">Date (plus récente à plus ancienne)</option>
          <option value="dateOldToRecent">Date (plus ancienne à plus récente )</option>
          <option value="kilosAvailable">Nombre de kilos disponibles</option>
        </select>
      </div>
      <Annonces data={sortedData} />
    </>
  );
};

export default FilterDropdown;
