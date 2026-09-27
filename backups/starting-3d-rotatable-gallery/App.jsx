import { useCallback, useEffect, useMemo, useState } from "react";
import { photos } from "./data/photos.js";
import LoadingScreen from "./components/LoadingScreen.jsx";
import PhotoSpace from "./components/PhotoSpace.jsx";
import PhotoViewer from "./components/PhotoViewer.jsx";

const tileCount = 280;

export default function App() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const repeatedPhotos = useMemo(
    () => {
      if (photos.length === 0) return [];
      return Array.from({ length: tileCount }, (_, index) => {
        const source = photos[index % photos.length];
        return { ...source, id: `${source.id}-${index}`, index };
      });
    },
    [],
  );
  const handleReady = useCallback(() => {}, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <main className="photo-stage">
      <PhotoSpace
        photos={repeatedPhotos}
        onSelectPhoto={setSelectedPhoto}
        onReady={handleReady}
      />
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
