import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProperty, getPropertyById, updateProperty } from '../api/properties';
import { uploadImages } from '../api/upload';
import InputField from '../components/InputField';

const TYPES = ['Apartment', 'House', 'Studio'];

const emptyForm = {
  title: '', description: '', price: '',
  city: '', country: '', type: 'Apartment',
};

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);

export default function PropertyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(emptyForm);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    getPropertyById(id)
      .then((res) => {
        const p = res.data.property;
        setForm({
          title: p.title, description: p.description, price: String(p.price),
          city: p.city, country: p.country, type: p.type,
        });
        setImageUrls(p.imageUrls || []);
      })
      .catch(() => setServerError('Could not load property data.'))
      .finally(() => setFetching(false));
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const previews = files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setUploadQueue((prev) => [...prev, ...previews]);
    e.target.value = '';
  };

  const removeQueued = (idx) => {
    setUploadQueue((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const removeUploaded = (idx) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (!uploadQueue.length) return;
    setUploading(true);
    setUploadError('');
    try {
      const res = await uploadImages(uploadQueue.map((q) => q.file));
      setImageUrls((prev) => [...prev, ...res.data.urls]);
      uploadQueue.forEach((q) => URL.revokeObjectURL(q.preview));
      setUploadQueue([]);
    } catch {
      setUploadError('Upload failed. Check file size (max 5MB each) and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setServerError('');
    setLoading(true);
    const payload = { ...form, price: Number(form.price), imageUrls };
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

          {/* Image upload section */}
          <div className="form-group">
            <label>Photos</label>

            {/* Already-uploaded images */}
            {imageUrls.length > 0 && (
              <div className="upload-preview-grid">
                {imageUrls.map((url, i) => (
                  <div key={i} className="upload-thumb">
                    <img src={url} alt={`Photo ${i + 1}`} />
                    <button type="button" className="upload-thumb-remove" onClick={() => removeUploaded(i)} aria-label="Remove photo">
                      <XIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Queued (not yet uploaded) */}
            {uploadQueue.length > 0 && (
              <div className="upload-preview-grid">
                {uploadQueue.map((q, i) => (
                  <div key={i} className="upload-thumb upload-thumb-queued">
                    <img src={q.preview} alt={`Queued ${i + 1}`} />
                    <button type="button" className="upload-thumb-remove" onClick={() => removeQueued(i)} aria-label="Remove queued photo">
                      <XIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone */}
            <button
              type="button"
              className="upload-dropzone"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon />
              <span>Click to select photos</span>
              <small>JPEG, PNG, WebP — max 5MB each</small>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {uploadQueue.length > 0 && (
              <button
                type="button"
                className="btn-secondary btn-block"
                onClick={handleUpload}
                disabled={uploading}
                style={{ marginTop: '0.5rem' }}
              >
                {uploading ? 'Uploading…' : `Upload ${uploadQueue.length} photo${uploadQueue.length > 1 ? 's' : ''}`}
              </button>
            )}
            {uploadError && <span className="error-text">{uploadError}</span>}
          </div>

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
