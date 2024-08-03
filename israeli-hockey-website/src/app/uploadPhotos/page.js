"use client";

import UploadPhotosClient from './UploadPhotosClient';
import ProtectedPage from "../ProtectedPage/ProtectedPage";


const query_photos = `SELECT Photo_ID, Photo FROM Photos;`;

async function fetchData() {
  let photosData = [];
  try {
    const response = await fetch(`/api/fetch`, { // Use relative URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query_photos }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    photosData = await response.json();
    return photosData; // Return the parsed data
  } catch (error) {
    console.error("Error fetching photos:", error);
  }
  return photosData;
}

export default async function Page() {
  const initialPhotos = await fetchData();
  return <ProtectedPage content={<UploadPhotosClient initialPhotos={initialPhotos} />}
    allowed_user_types={[]}
  />;
}
