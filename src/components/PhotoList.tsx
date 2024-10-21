import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import PhotoItem from './PhotoItem';
import { FaSpinner } from 'react-icons/fa6';

const PHOTOS_LIMIT = 300;

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cols, setCols] = useState(3);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastPhotoElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const accessToken = import.meta.env.VITE_UNSPLASH_ACCESS_TOKEN;

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://api.unsplash.com/photos`, {
          params: {
            client_id: accessToken,
            page: page,
            per_page: 30,
          },
        });
        setPhotos((prevPhotos) => {
          const newPhotos = [...prevPhotos, ...res.data];
          return newPhotos.slice(-PHOTOS_LIMIT);
        });
        setHasMore(res.data.length > 0);
      } catch (error) {
        console.error(`Error fetching photos: ${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [page]);

  const columnIndices = Array.from({ length: cols }).map((_, colIndex) =>
    Array.from({ length: Math.ceil(photos.length / cols) }, (_, rowIndex) => rowIndex * cols + colIndex).filter(
      (index) => index < photos.length
    )
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCols(1);
      } else if (window.innerWidth < 768) {
        setCols(2);
      } else if (window.innerWidth < 1024) {
        setCols(3);
      } else {
        setCols(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex md:flex-row flex-col md:gap-4">
      {columnIndices.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col flex-1 gap-4">
          {column.map((photoIndex) => {
            const photo = photos[photoIndex];
            return (
              <PhotoItem
                key={photo.id}
                photo={photo}
                ref={photoIndex === photos.length - 1 ? lastPhotoElementRef : null}
              />
            );
          })}
        </div>
      ))}
      {loading && (
        <div className="flex justify-center items-center col-span-full w-full h-screen">
          <FaSpinner className="text-6xl text-blue-300 animate-spin" />
        </div>
      )}
      {!hasMore && <div className="col-span-full py-4 text-center">No more photos</div>}
    </div>
  );
};

export default PhotoGallery;
