export default function InputField({ label, id, error, ...props }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} className={`form-input${error ? ' input-error' : ''}`} {...props} />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
