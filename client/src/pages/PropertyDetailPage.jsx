import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById, deleteProperty } from '../api/properties';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

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

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

function ImageCarousel({ images, title }) {
  const [idx, setIdx] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="carousel-placeholder">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <span>No photos provided</span>
      </div>
    );
  }

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div className="carousel">
      <div className="carousel-track">
        <img
          key={idx}
          src={images[idx]}
          alt={`${title} — photo ${idx + 1} of ${images.length}`}
          loading={idx === 0 ? 'eager' : 'lazy'}
          className="carousel-img"
        />
        {images.length > 1 && (
          <>
            <button className="carousel-btn carousel-btn-prev" onClick={prev} aria-label="Previous photo">
              <ChevronLeft />
            </button>
            <button className="carousel-btn carousel-btn-next" onClick={next} aria-label="Next photo">
              <ChevronRight />
            </button>
            <span className="carousel-counter">{idx + 1} / {images.length}</span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="carousel-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === idx ? ' active' : ''}`}
              onClick={() => setIdx(i)}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { ids, toggle } = useFavorites();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [favoriting, setFavoriting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPropertyById(id)
      .then((res) => { if (!cancelled) setProperty(res.data.property); })
      .catch(() => { if (!cancelled) setError('This property could not be found.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const isOwner = user && property && property.owner._id.toString() === user._id.toString();
  const isFavorited = ids.has(id);

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

  const handleFavorite = async () => {
    if (!user) { navigate('/login'); return; }
    setFavoriting(true);
    await toggle(id);
    setFavoriting(false);
  };

  if (loading) return <div className="main-content"><p className="state-msg">Loading property…</p></div>;
  if (error) return <div className="main-content"><p className="state-msg error-msg">{error}</p></div>;

  const { title, description, price, city, country, type, imageUrls, owner } = property;

  return (
    <div className="main-content">
      <div className="detail-page">
        <ImageCarousel images={imageUrls} title={title} />

        <div className="detail-content">
          <div className="detail-header">
            <div style={{ flex: 1 }}>
              <span className="detail-type-badge">{type}</span>
              <h1>{title}</h1>
              <p className="detail-location"><LocationIcon />{city}, {country}</p>
            </div>
            <div className="detail-header-right">
              <div className="detail-price">
                ${price.toLocaleString()}
                <span>per month</span>
              </div>
              {!isOwner && (
                <button
                  className={`btn-favorite-lg${isFavorited ? ' active' : ''}`}
                  onClick={handleFavorite}
                  disabled={favoriting}
                  aria-label={isFavorited ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  <HeartIcon filled={isFavorited} />
                  {isFavorited ? 'Saved' : 'Save'}
                </button>
              )}
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
