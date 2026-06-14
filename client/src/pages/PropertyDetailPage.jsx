import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById, deleteProperty } from '../api/properties';
import { useAuth } from '../context/AuthContext';

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getPropertyById(id)
      .then((res) => setProperty(res.data.property))
      .catch(() => setError('This property could not be found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user && property && property.owner._id === user._id;

  const handleDelete = async () => {
    if (!window.confirm('Permanently delete this property? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteProperty(id);
      navigate('/dashboard');
    } catch {
      setError('Failed to delete property. Please try again.');
      setDeleting(false);
    }
  };

  if (loading) return <div className="main-content"><p className="state-msg">Loading property…</p></div>;
  if (error) return <div className="main-content"><p className="state-msg error-msg">{error}</p></div>;

  const { title, description, price, city, country, type, imageUrls, owner } = property;

  return (
    <div className="main-content">
      <div className="detail-page">
        <div className="detail-images">
          {imageUrls?.length > 0 ? (
            imageUrls.map((url, i) => (
              <img key={i} src={url} alt={`${title} — photo ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
            ))
          ) : (
            <div className="detail-img-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>No photos provided</span>
            </div>
          )}
        </div>

        <div className="detail-content">
          <div className="detail-header">
            <div style={{ flex: 1 }}>
              <span className="detail-type-badge">{type}</span>
              <h1>{title}</h1>
              <p className="detail-location"><LocationIcon />{city}, {country}</p>
            </div>
            <div className="detail-price">
              ${price.toLocaleString()}
              <span>per month</span>
            </div>
          </div>

          <div className="detail-divider" />
          <p className="detail-description">{description}</p>

          <div className="detail-owner">
            <UserIcon />
            <span>Listed by <strong>{owner.name || owner.username}</strong></span>
            {owner.phone && <span style={{ color: 'var(--text-light)' }}>·</span>}
            {owner.phone && <span>{owner.phone}</span>}
          </div>

          {isOwner && (
            <div className="detail-actions">
              <Link to={`/properties/${id}/edit`} className="btn-primary">Edit Listing</Link>
              <button onClick={handleDelete} className="btn-danger" disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete Listing'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
