import { Link } from 'react-router-dom';

const LocationIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

export default function PropertyCard({ property }) {
  const { _id, title, city, country, price, type, imageUrls } = property;
  const thumb = imageUrls?.length > 0 ? imageUrls[0] : null;

  return (
    <Link to={`/properties/${_id}`} className="property-card" aria-label={`${title} — $${price.toLocaleString()} per month`}>
      <div className="property-card-img">
        {thumb ? (
          <img src={thumb} alt={title} loading="lazy" />
        ) : (
          <div className="property-card-img-placeholder">
            <ImageIcon />
            <span style={{ fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>No Photo</span>
          </div>
        )}
        <div className="property-card-img-overlay" aria-hidden="true" />
        <span className="property-type-badge">{type}</span>
        <span className="property-card-price-overlay">${price.toLocaleString()}<span style={{ fontSize: '0.65rem', opacity: 0.85 }}>/mo</span></span>
      </div>
      <div className="property-card-body">
        <h3 className="property-card-title">{title}</h3>
        <p className="property-card-location">
          <LocationIcon />
          {city}, {country}
        </p>
      </div>
    </Link>
  );
}
