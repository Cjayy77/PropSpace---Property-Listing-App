import { useState } from 'react';
import InputField from './InputField';

export default function FilterSidebar({ onFilter }) {
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ city: city.trim(), minPrice, maxPrice });
  };

  const handleReset = () => {
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    onFilter({});
  };

  return (
    <aside className="filter-sidebar">
      <h3>Filter Properties</h3>
      <form onSubmit={handleSubmit}>
        <InputField
          label="City"
          id="filter-city"
          type="text"
          placeholder="e.g. Paris"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <InputField
          label="Min Price ($)"
          id="filter-min"
          type="number"
          placeholder="0"
          min="0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <InputField
          label="Max Price ($)"
          id="filter-max"
          type="number"
          placeholder="Any"
          min="0"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button type="submit" className="btn-primary btn-block">Apply</button>
        <button type="button" className="btn-secondary btn-block" onClick={handleReset}>
          Reset
        </button>
      </form>
    </aside>
  );
}
