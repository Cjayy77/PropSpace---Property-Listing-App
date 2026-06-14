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

  useEffect(() => { fetchProperties(); }, []);

  return (
    <div>
      <section className="home-hero">
        <h1>Find Your Perfect Space</h1>
        <p>Browse properties for rent and sale from owners around the world.</p>
      </section>

      <div className="main-content">
        <div className="home-layout">
          <FilterSidebar onFilter={fetchProperties} />
          <main>
            {!loading && !error && (
              <p className="section-label">
                {properties.length} {properties.length === 1 ? 'property' : 'properties'}
              </p>
            )}
            {loading && <p className="state-msg">Loading properties…</p>}
            {error && <p className="state-msg error-msg">{error}</p>}
            {!loading && !error && properties.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <h3>No properties found</h3>
                <p>Try adjusting your filters or clearing your search.</p>
              </div>
            )}
            {!loading && !error && properties.length > 0 && (
              <div className="property-grid">
                {properties.map((p) => <PropertyCard key={p._id} property={p} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
