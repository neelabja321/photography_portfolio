import { useState, useEffect } from 'react';

export function usePhotos() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch('/photos.json');
        if (!response.ok) {
          throw new Error('Failed to fetch photos manifest');
        }
        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        console.error('Error fetching photos:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPhotos();
  }, []);

  return { photos, isLoading, error };
}
