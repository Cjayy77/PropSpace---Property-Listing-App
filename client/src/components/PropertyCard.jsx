import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

const LocationIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

export default function PropertyCard({ property }) {
  const { _id, title, city, country, price, type, imageUrls } = property;
  const thumb = imageUrls?.length > 0 ? imageUrls[0] : null;
  const { ids, toggle } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isFavorited = ids.has(_id);

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    await toggle(_id);
  };

  return (
    <Link to={`/properties/${_id}`} className="property-card" aria-label={`${title}, ${city} — $${price.toLocaleString()} per month`}>
      <div className="property-card-img">
        {thumb ? (
          <img src={thumb} alt={title} loading="lazy" />
        ) : (
          <div className="property-card-img-placeholder">
            <ImageIcon />
          </div>
        )}
        <span className="property-type-badge">{type}</span>
        <button
          className={`card-heart-btn${isFavorited ? ' active' : ''}`}
          onClick={handleFavorite}
          aria-label={isFavorited ? 'Remove from watchlist' : 'Save to watchlist'}
        >
          <HeartIcon filled={isFavorited} />
        </button>
      </div>
      <div className="property-card-body">
        <div className="property-card-row">
          <h3 className="property-card-title">{title}</h3>
          <p className="property-card-price">${price.toLocaleString()}<span>/mo</span></p>
        </div>
        <p className="property-card-location">
          <LocationIcon />{city}, {country}
        </p>
      </div>
    </Link>
  );
}
