import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProperty, getPropertyById, updateProperty } from '../api/properties';
import InputField from '../components/InputField';

const TYPES = ['Apartment', 'House', 'Studio'];

const emptyForm = {
  title: '', description: '', price: '',
  city: '', country: '', type: 'Apartment', imageUrls: '',
};

export default function PropertyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    getPropertyById(id)
      .then((res) => {
        if (cancelled) return;
        const p = res.data.property;
        setForm({
          title: p.title, description: p.description, price: String(p.price),
          city: p.city, country: p.country, type: p.type,
          imageUrls: (p.imageUrls || []).join(', '),
        });
      })
      .catch(() => { if (!cancelled) setServerError('Could not load property data.'); })
      .finally(() => { if (!cancelled) setFetching(false); });
    return () => { cancelled = true; };
  }, [id, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price) e.price = 'Price is required';
    else if (isNaN(Number(form.price)) || Number(form.price) < 0) e.price = 'Price must be a positive number';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.country.trim()) e.country = 'Country is required';
    if (!TYPES.includes(form.type)) e.type = 'Select a valid type';
    return e;
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setServerError('');
    setLoading(true);
    const payload = {
      ...form,
      price: Number(form.price),
      imageUrls: form.imageUrls.split(',').map((u) => u.trim()).filter(Boolean),
    };
    try {
      if (isEdit) {
        await updateProperty(id, payload);
        navigate(`/properties/${id}`);
      } else {
        const res = await createProperty(payload);
        navigate(`/properties/${res.data.property._id}`);
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to save property.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="main-content"><p className="state-msg">Loading…</p></div>;

  return (
    <div className="main-content">
      <div className="form-page">
        <h2>{isEdit ? 'Edit Listing' : 'List a Property'}</h2>
        <p className="form-page-sub">
          {isEdit ? 'Update your property details below.' : 'Fill in the details to publish your listing.'}
        </p>
        {serverError && <p className="error-banner" role="alert">{serverError}</p>}
        <form onSubmit={handleSubmit} noValidate className="property-form">
          <InputField label="Title" id="title" name="title" value={form.title}
            onChange={handleChange} error={errors.title} placeholder="e.g. Bright 2BR in City Centre" />

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={form.description}
              onChange={handleChange} rows={4}
              className={`form-input${errors.description ? ' input-error' : ''}`}
              placeholder="Describe the space, amenities, neighborhood…" />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <InputField label="Monthly Rent ($)" id="price" name="price" type="number"
            min="0" value={form.price} onChange={handleChange} error={errors.price}
            placeholder="e.g. 1500" />

          <div className="form-row">
            <InputField label="City" id="city" name="city" value={form.city}
              onChange={handleChange} error={errors.city} placeholder="e.g. Paris" />
            <InputField label="Country" id="country" name="country" value={form.country}
              onChange={handleChange} error={errors.country} placeholder="e.g. France" />
          </div>

          <div className="form-group">
            <label htmlFor="type">Property Type</label>
            <select id="type" name="type" value={form.type} onChange={handleChange}
              className={`form-input${errors.type ? ' input-error' : ''}`}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.type && <span className="error-text">{errors.type}</span>}
          </div>

          <InputField label="Photo URLs (comma-separated)" id="imageUrls" name="imageUrls"
            value={form.imageUrls} onChange={handleChange}
            placeholder="https://…, https://…" />

          <div style={{ marginTop: '0.5rem' }}>
            <button type="submit" className="btn-primary btn-block" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Update Listing' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
