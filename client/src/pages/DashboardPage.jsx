import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProperties, deleteProperty } from '../api/properties';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyProperties()
      .then((res) => setProperties(res.data.properties))
      .catch(() => setError('Failed to load your listings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this listing? This cannot be undone.')) return;
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError('Failed to delete. Please try again.');
    }
  };

  return (
    <div className="main-content">
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h2>My Listings</h2>
            <p className="dashboard-header-sub">
              Welcome back, {user?.name || user?.username} — manage your properties below.
            </p>
          </div>
          <Link to="/properties/new" className="btn-primary">
            <PlusIcon /> New Listing
          </Link>
        </div>

        {loading && <p className="state-msg">Loading your listings…</p>}
        {error && <p className="state-msg error-msg" role="alert">{error}</p>}

        {!loading && !error && properties.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h3>No listings yet</h3>
            <p>You haven't published any properties. Create your first listing to get started.</p>
            <Link to="/properties/new" className="btn-primary">
              <PlusIcon /> Create First Listing
            </Link>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <>
            <p className="section-label">{properties.length} Listing{properties.length !== 1 ? 's' : ''}</p>
            <div className="dashboard-grid">
              {properties.map((p) => (
                <div key={p._id} className="dashboard-card-wrapper">
                  <PropertyCard property={p} />
                  <div className="dashboard-card-actions">
                    <Link to={`/properties/${p._id}/edit`} className="btn-secondary-sm">Edit</Link>
                    <button onClick={() => handleDelete(p._id)} className="btn-danger-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
