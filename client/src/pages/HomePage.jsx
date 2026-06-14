import { useState, useEffect } from 'react';
import { getAllProperties } from '../api/properties';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProperties = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      const res = await getAllProperties(params);
      setProperties(res.data.properties);
    } catch {
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="home-page">
      <section className="home-hero">
        <h1>Find Your Perfect Space</h1>
        <p>Browse thousands of properties for rent and sale.</p>
      </section>
      <div className="home-layout">
        <FilterSidebar onFilter={fetchProperties} />
        <main className="property-grid-container">
          {loading && <p className="state-msg">Loading properties…</p>}
          {error && <p className="state-msg error-msg">{error}</p>}
          {!loading && !error && properties.length === 0 && (
            <p className="state-msg">No properties match your search.</p>
          )}
          {!loading && !error && properties.length > 0 && (
            <div className="property-grid">
              {properties.map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
