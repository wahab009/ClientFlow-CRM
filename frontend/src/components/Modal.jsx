export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon-button" onClick={onClose} aria-label="Close modal">
            X
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
