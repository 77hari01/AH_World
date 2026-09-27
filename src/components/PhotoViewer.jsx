export default function PhotoViewer({ photo, onClose }) {
  return (
    <div className="viewer-backdrop" role="dialog" aria-modal="true" aria-label={photo.title}>
      <button className="viewer-close" type="button" onClick={onClose} aria-label="Close photo">
        x
      </button>
      <figure className="viewer-frame">
        <img src={photo.src} alt={photo.title} />
        <figcaption>{photo.title}</figcaption>
      </figure>
    </div>
  );
}
