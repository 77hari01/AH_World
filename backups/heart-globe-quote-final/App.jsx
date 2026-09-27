import { useEffect, useMemo, useRef, useState } from "react";
import { photos } from "./data/photos.js";
import PhotoViewer from "./components/PhotoViewer.jsx";

const globePhotoCount = 48;

export default function App() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [rotation, setRotation] = useState({ x: -8, y: 0 });
  const drag = useRef({ active: false, x: 0, y: 0 });

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const handlePointerDown = (event) => {
    drag.current.active = true;
    drag.current.x = event.clientX;
    drag.current.y = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!drag.current.active) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    drag.current.x = event.clientX;
    drag.current.y = event.clientY;
    setRotation((current) => ({
      x: Math.max(-32, Math.min(32, current.x + dy * 0.2)),
      y: current.y + dx * 0.28,
    }));
  };

  const handlePointerUp = (event) => {
    drag.current.active = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (drag.current.active) return;
      setRotation((current) => ({ ...current, y: current.y + 0.12 }));
    }, 40);
    return () => window.clearInterval(timer);
  }, []);

  const galleryPhotos = useMemo(
    () => Array.from({ length: globePhotoCount }, (_, index) => {
      const source = photos[index % photos.length];
      const row = Math.floor(index / 16);
      const column = index % 16;
      const latitude = -34 + row * 22;
      const longitude = column * 22.5 + (row % 2) * 11.25;
      return {
        ...source,
        id: `${source.id}-${index}`,
        transform: `rotateY(${longitude}deg) rotateX(${latitude}deg) translateZ(300px)`,
      };
    }),
    [photos],
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
        <div className="heart-message">
          <span className="center-kicker">OUR STORY</span>
          <p>
            Some memories become our little world,
            <br />
            and some moments become forever.
            <br />
            <em>This is only the beginning of our story.</em>
          </p>
        </div>
        <span className="center-hint">click and drag to explore 360°</span>
      </div>
      {photos.length === 0 && (
        <p className="empty-message">Add PNG or JPEG photos in src/assets/photos</p>
      )}
      {selectedPhoto && <PhotoViewer photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </main>
  );
}
