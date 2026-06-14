import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProperties, deleteProperty } from '../api/properties';
import PropertyCard from '../components/PropertyCard';

export default function DashboardPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMine = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getMyProperties();
      setProperties(res.data.properties);
    } catch {
      setError('Failed to load your listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMine(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property? This cannot be undone.')) return;
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError('Failed to delete property.');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>My Listings</h2>
        <Link to="/properties/new" className="btn-primary">+ New Listing</Link>
      </div>
      {loading && <p className="state-msg">Loading your listings…</p>}
      {error && <p className="state-msg error-msg">{error}</p>}
      {!loading && !error && properties.length === 0 && (
        <div className="empty-state">
          <p>You haven't listed any properties yet.</p>
          <Link to="/properties/new" className="btn-primary">List your first property</Link>
        </div>
      )}
      {!loading && !error && properties.length > 0 && (
        <div className="dashboard-grid">
          {properties.map((p) => (
            <div key={p._id} className="dashboard-card-wrapper">
              <PropertyCard property={p} />
              <div className="dashboard-card-actions">
                <Link to={`/properties/${p._id}/edit`} className="btn-secondary-sm">Edit</Link>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="btn-danger-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
