import { useState } from 'react';
import InputField from './InputField';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest first' },
  { value: 'price_asc',  label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
];

export default function FilterSidebar({ onFilter }) {
  const [city, setCity]         = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy]     = useState('newest');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ city: city.trim(), minPrice, maxPrice, sortBy });
  };

  const handleReset = () => {
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    onFilter({});
  };

  return (
    <aside className="filter-sidebar">
      <h3>Filter &amp; Sort</h3>
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

        <div className="form-group">
          <label htmlFor="filter-sort">Sort By</label>
          <select
            id="filter-sort"
            className="form-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary btn-block">Apply</button>
        <button type="button" className="btn-secondary btn-block" onClick={handleReset}>
          Reset
        </button>
      </form>
    </aside>
  );
}
