import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FcLike } from 'react-icons/fc';
import { FaCalendar } from 'react-icons/fa6';

interface Photo {
  id: string;
  urls: {
    full: string;
    regular: string;
  };
  user: {
    name: string;
    username: string;
    profile_image: {
      medium: string;
    };
  };
  description: string | null;
  alt_description: string | null;
  likes: number;
  width: number;
  height: number;
  created_at: string;
}

const PhotoDetails: React.FC = () => {
  const { id: photoId } = useParams<{ id: string }>();
  const accessToken = import.meta.env.VITE_UNSPLASH_ACCESS_TOKEN;
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://api.unsplash.com/photos/${photoId}`, {
          params: {
            client_id: accessToken,
          },
        });
        setPhoto(res.data);
        setError(null);
      } catch (error) {
        console.error(`Error fetching photo: ${(error as Error).message}`);
        setError('Failed to load photo details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();
  }, [photoId, accessToken]);

  if (loading) return <div className="py-8 text-center">Loading...</div>;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;
  if (!photo) return <div className="py-8 text-center">Photo not found</div>;

  return (
    <div className="mx-auto px-4 py-4 max-w-5xl">
      <Link to="/" className="inline-block mb-4 text-blue-500 hover:underline">
        &larr; Back to photos
      </Link>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={photo.urls.regular}
          alt={photo.alt_description || 'Unsplash photo'}
          className="w-full h-auto object-cover"
        />

        <div className="p-6">
          <div className="flex items-center mb-4">
            <img src={photo.user.profile_image.medium} alt={photo.user.name} className="mr-4 rounded-full w-10 h-10" />
            <div>
              <h2 className="font-bold text-xl">{photo.user.name}</h2>
              <a
                href={`https://unsplash.com/@${photo.user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 text-sm hover:underline"
              >
                @{photo.user.username}
              </a>
            </div>
          </div>

          <h1 className="mb-2 font-bold text-2xl">{photo.description || photo.alt_description || 'Untitled'}</h1>

          <p className="mb-4 text-gray-700">
            {photo.description || photo.alt_description || 'No description available'}
          </p>

          <div className="flex flex-col justify-between gap-4 text-gray-600 text-sm">
            <span className="flex items-center">
              Likes: {photo.likes} <FcLike className="ml-1" />
            </span>
            <span>
              Dimensions: {photo.width} x {photo.height} pixels
            </span>
            <span className="flex items-center">
              Published on: {new Date(photo.created_at).toLocaleDateString()}
              <FaCalendar className="ml-1" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetails;
