import { useState, useEffect } from 'react';
import { getWatchlist } from '../api/favorites';
import PropertyCard from '../components/PropertyCard';

const HeartIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

export default function WatchlistPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getWatchlist()
      .then((res) => setProperties(res.data.favorites.map((f) => f.property)))
      .catch(() => setError('Failed to load your watchlist.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="main-content">
      <div className="page-header">
        <h2>Saved Properties</h2>
        <p className="page-sub">Properties you've saved to your watchlist.</p>
      </div>

      {loading && <p className="state-msg">Loading watchlist…</p>}
      {error && <p className="state-msg error-msg">{error}</p>}

      {!loading && !error && properties.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <HeartIcon />
          </div>
          <h3>No saved properties yet</h3>
          <p>Browse listings and click the heart icon to save properties here.</p>
        </div>
      )}

      {!loading && !error && properties.length > 0 && (
        <>
          <p className="section-label">
            {properties.length} saved {properties.length === 1 ? 'property' : 'properties'}
          </p>
          <div className="property-grid">
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
