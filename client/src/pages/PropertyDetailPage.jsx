import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById, deleteProperty } from '../api/properties';
import { useAuth } from '../context/AuthContext';

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
      .catch(() => setError('Property not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user && property && property.owner._id === user._id;

  const handleDelete = async () => {
    if (!window.confirm('Delete this property? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteProperty(id);
      navigate('/dashboard');
    } catch {
      setError('Failed to delete property.');
      setDeleting(false);
    }
  };

  if (loading) return <p className="state-msg">Loading property…</p>;
  if (error) return <p className="state-msg error-msg">{error}</p>;

  const { title, description, price, city, country, type, imageUrls, owner } = property;

  return (
    <div className="detail-page">
      <div className="detail-images">
        {imageUrls && imageUrls.length > 0 ? (
          imageUrls.map((url, i) => <img key={i} src={url} alt={`${title} ${i + 1}`} />)
        ) : (
          <div className="detail-img-placeholder">No images provided</div>
        )}
      </div>
      <div className="detail-content">
        <div className="detail-header">
          <div>
            <span className="property-type-badge">{type}</span>
            <h1>{title}</h1>
            <p className="detail-location">{city}, {country}</p>
          </div>
          <div className="detail-price">${price.toLocaleString()}<span>/mo</span></div>
        </div>
        <p className="detail-description">{description}</p>
        <div className="detail-owner">
          <strong>Listed by:</strong> {owner.name || owner.username}
          {owner.phone && <> &bull; {owner.phone}</>}
        </div>
        {isOwner && (
          <div className="detail-actions">
            <Link to={`/properties/${id}/edit`} className="btn-primary">Edit</Link>
            <button onClick={handleDelete} className="btn-danger" disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
