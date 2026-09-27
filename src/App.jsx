import { useCallback, useEffect, useRef, useState } from "react";
import { photos } from "./data/photos.js";
import PhotoSpace from "./components/PhotoSpace.jsx";
import PhotoViewer from "./components/PhotoViewer.jsx";

export default function App() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState(photos);
  const inputRef = useRef(null);
  const handleReady = useCallback(() => {}, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const addPhotos = (event) => {
    const incoming = Array.from(event.target.files ?? [])
      .filter((file) => file.type.startsWith("image/"))
      .map((file, index) => ({
        id: `local-${Date.now()}-${index}-${file.name}`,
        title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        src: URL.createObjectURL(file),
        local: true,
      }));

    if (incoming.length > 0) setGalleryPhotos((current) => [...current, ...incoming]);
    event.target.value = "";
  };

  return (
    <main className="photo-stage">
      <PhotoSpace
        photos={galleryPhotos}
        onSelectPhoto={setSelectedPhoto}
        onReady={handleReady}
      />
      <header className="experience-header">
        <div className="brand-mark" aria-label="Memory space">
          <span className="brand-dot" />
          <span>MEMORY SPACE</span>
        </div>
        <div className="gallery-status">
          <span className="status-pulse" />
          {galleryPhotos.length} memories · live
        </div>
      </header>
      <div className="center-copy" aria-hidden="true">
        <span className="center-kicker">A UNIVERSE MADE OF</span>
        <h1>memories</h1>
        <span className="center-hint">drag to drift through the collection</span>
      </div>
      <div className="experience-footer">
        <span className="footer-line" />
        <span>360° memory archive</span>
        <button type="button" onClick={() => inputRef.current?.click()}>
          + Add memories
        </button>
        <input
          ref={inputRef}
          className="visually-hidden"
          type="file"
          accept="image/*"
          multiple
          onChange={addPhotos}
        />
      </div>
      {galleryPhotos.length === 0 && (
        <p className="empty-message">Add PNG or JPEG photos to begin your memory space.</p>
      )}
      {selectedPhoto && <PhotoViewer photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </main>
  );
}
