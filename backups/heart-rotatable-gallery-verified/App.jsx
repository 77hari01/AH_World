import { useEffect, useMemo, useState } from "react";
import { photos } from "./data/photos.js";
import LoadingScreen from "./components/LoadingScreen.jsx";
import PhotoViewer from "./components/PhotoViewer.jsx";

const tileCount = 280;

export default function App() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [rotation, setRotation] = useState({ x: -8, y: 0 });
  const drag = useMemo(() => ({ active: false, x: 0, y: 0 }), []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const handlePointerDown = (event) => {
    drag.active = true;
    drag.x = event.clientX;
    drag.y = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!drag.active) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    drag.x = event.clientX;
    drag.y = event.clientY;
    setRotation((current) => ({
      x: Math.max(-46, Math.min(46, current.x + dy * 0.28)),
      y: current.y + dx * 0.34,
    }));
  };

  const handlePointerUp = (event) => {
    drag.active = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const galleryPhotos = useMemo(
    () => Array.from({ length: tileCount }, (_, index) => {
      const source = photos[index % photos.length];
      const row = Math.floor(index / 20);
      const column = index % 20;
      return {
        ...source,
        id: `${source.id}-${index}`,
        transform: `rotateY(${column * 18}deg) rotateX(${(row - 0.5) * 38}deg) translateZ(390px)`,
      };
    }),
    [],
  );

  return (
    <main className="photo-stage">
      <div
        className="css-photo-space"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="css-photo-sphere"
          style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
        >
          {galleryPhotos.map((photo) => (
            <button
              className="css-photo-tile"
              key={photo.id}
              type="button"
              style={{ transform: photo.transform }}
              onClick={() => setSelectedPhoto(photo)}
              aria-label={`Open ${photo.title}`}
            >
              <img src={photo.src} alt={photo.title} draggable="false" />
            </button>
          ))}
        </div>
      </div>
      <div className="center-overlay" aria-hidden="true">
        <span className="center-kicker">MEMORIES IN MOTION</span>
        <h1>H</h1>
        <span className="center-hint">click and drag to explore 360°</span>
      </div>
      {photos.length === 0 && (
        <p className="empty-message">Add PNG or JPEG photos in src/assets/photos</p>
      )}
      {selectedPhoto && <PhotoViewer photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
      {isLoading && <LoadingScreen />}
    </main>
  );
}
