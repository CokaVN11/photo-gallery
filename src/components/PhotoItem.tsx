import localforage from 'localforage';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';

const imageCache = localforage.createInstance({
  name: 'image-cache',
});

const getImage = async (photoId: string, url: string) => {
  const cacheKey = `photo-${photoId}`;
  try {
    const cachedImage = await imageCache.getItem<Blob>(cacheKey);
    if (cachedImage) {
      return URL.createObjectURL(cachedImage);
    }

    const res = await fetch(url);
    const blob = await res.blob();
    await imageCache.setItem(cacheKey, blob);
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error((err as Error).message);
    return url;
  }
};

const PhotoItem = React.forwardRef<HTMLDivElement, { photo: Photo }>(({ photo }, ref) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleImage = async () => {
      try {
        setLoading(true);
        const blobUrl = await getImage(photo.id, photo.urls.thumb);
        setImgUrl(blobUrl);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    handleImage();
  }, [photo.id, photo.urls.thumb]);

  return (
    <div key={photo.id} ref={ref} className="relative bg-gray-100 shadow-md rounded-lg group">
      <Link to={`/photos/${photo.id}`}>
        {loading ? (
          <div className="bg-gray-300 w-32 h-32 animate-pulse"></div>
        ) : (
          <img src={imgUrl as string} alt={photo.user.name} className="rounded-lg w-full object-cover" />
        )}
      </Link>
      <div className="right-0 bottom-0 left-0 absolute bg-black bg-opacity-50 group-hover:opacity-100 p-2 rounded-b-lg text-white transition-opacity">
        <div className="flex items-center">
          <img src={photo.user.profile_image.medium} alt={photo.user.name} className="mr-4 rounded-full w-10 h-10" />
          <p className="items-center font-semibold text-sm">{photo.user.name}</p>
        </div>
      </div>
    </div>
  );
});

export default PhotoItem;
