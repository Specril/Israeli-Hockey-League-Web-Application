import dataFetchPhotos from './fetchPhotos';
import UploadPhotosClient from './UploadPhotosClient';

export default async function Page() {
  const initialPhotos = await dataFetchPhotos();
  return <UploadPhotosClient initialPhotos={initialPhotos} />;
}
