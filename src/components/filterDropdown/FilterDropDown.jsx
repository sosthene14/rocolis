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
  const sortByDateRecentToOld = (a, b) => new Date(b.dateDepart) - new Date(a.dateDepart);
  const sortByDateOldToRecent = (a, b) => new Date(a.dateDepart) - new Date(b.dateDepart);
  const sortByKilosAvailable = (a, b) => b.kilosDispo - a.kilosDispo;
  const sortByKilosAvailable2 = (a, b) => a.kilosDispo - b.kilosDispo;

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
      case 'kilosAvailable2':
        return data.sort(sortByKilosAvailable2);
      default:
        return data;
    }
  };

  const sortedData = sortData(selectedFilter);

  return (
    <>
      <div className='filter-div'>
        <label htmlFor="filterDropdown"></label>
        <select id="filterDropdown" className="shadow-md w-96 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none" value={selectedFilter} onChange={handleFilterChange}>
          <option  value="priceHighToLow">Prix kilo (du plus haut au plus bas)</option>
          <option value="priceLowToHigh">Prix kilo (du plus bas au plus haut)</option>
          <option value="dateRecentToOld">Date voyage (plus récente à plus ancienne)</option>
          <option value="dateOldToRecent">Date voyage (plus ancienne à plus récente )</option>
          <option value="kilosAvailable2">Nombre de kilos (plus bas au plus haut)</option>
          <option value="kilosAvailable">Nombre de kilos (plus haut au plus bas)</option>
        </select>
      </div>
      <Annonces data={sortedData} />
    </>
  );
};

export default FilterDropdown;
