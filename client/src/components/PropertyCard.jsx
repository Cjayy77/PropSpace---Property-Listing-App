import { Link } from 'react-router-dom';

export default function PropertyCard({ property }) {
  const { _id, title, city, country, price, type, imageUrls } = property;
  const thumb = imageUrls && imageUrls.length > 0 ? imageUrls[0] : null;

  return (
    <Link to={`/properties/${_id}`} className="property-card">
      <div className="property-card-img">
        {thumb ? (
          <img src={thumb} alt={title} />
        ) : (
          <div className="property-card-img-placeholder">No Image</div>
        )}
        <span className="property-type-badge">{type}</span>
      </div>
      <div className="property-card-body">
        <h3 className="property-card-title">{title}</h3>
        <p className="property-card-location">{city}, {country}</p>
        <p className="property-card-price">${price.toLocaleString()} / mo</p>
      </div>
    </Link>
  );
}
