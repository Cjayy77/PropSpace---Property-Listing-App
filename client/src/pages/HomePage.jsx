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
        <div className="hero-orb hero-orb-1" aria-hidden="true" />
        <div className="hero-orb hero-orb-2" aria-hidden="true" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="home-hero-eyebrow">Premium Real Estate</span>
          <h1>Find Your Perfect Space</h1>
          <p>Discover curated properties for rent and sale across the globe. Your next home is one search away.</p>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">2,400+</div>
              <div className="hero-stat-label">Active Listings</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} aria-hidden="true" />
            <div>
              <div className="hero-stat-value">180+</div>
              <div className="hero-stat-label">Cities Covered</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} aria-hidden="true" />
            <div>
              <div className="hero-stat-value">98%</div>
              <div className="hero-stat-label">Happy Tenants</div>
            </div>
          </div>
        </div>
      </section>

      <div className="main-content" style={{ paddingTop: 0 }}>
        <div className="home-layout">
          <FilterSidebar onFilter={fetchProperties} />
          <main>
            <p className="section-label">
              {loading ? 'Loading' : `${properties.length} Properties`}
            </p>
            {loading && <p className="state-msg">Searching listings…</p>}
            {error && <p className="state-msg error-msg">{error}</p>}
            {!loading && !error && properties.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <h3>No properties found</h3>
                <p>Try adjusting your filters or search a different city.</p>
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
