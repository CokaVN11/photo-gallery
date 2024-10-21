interface Photo {
  id: string;
  urls: { small: string; thumb: string; small_s3: string; full: string };
  user: { name: string; profile_image: { medium: string } };
  alt_description: string;
}
