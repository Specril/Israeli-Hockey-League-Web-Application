import React from 'react';
import { Carousel } from 'antd';

const CarouselComponent = ({ data = [] }) => {
  // Container style for the carousel
  const carouselStyle = {
    width: '800px', // Ensure the carousel takes the full width of the parent container
    height: '600px', // Adjust height based on your design
    margin: '0 auto',
  };

  // Style for images inside the carousel
  const imgStyle = {
    width: '800px', // Ensure image takes the full width of the carousel container
    height: '600px', // Ensure image takes the full height of the carousel container
    objectFit: 'cover', // Maintain aspect ratio
  };

  // Function to validate if the image data is correctly formatted
  const isValidBase64 = (base64Image) => {
    return (
      base64Image.startsWith("data:image/jpeg;base64,") || 
      base64Image.startsWith("data:image/png;base64,")
    );
  };

  return (
    <div className="carousel-container" style={{ width: '100%' }}>
      <Carousel autoplay style={carouselStyle} dots={true} arrows={true}>
        {data.length > 0 ? (
          data.map((item, index) => {
            const base64Image = item.Photo;
            console.log(`Image ${index + 1}:`, base64Image);
            return (
              <div key={index}>
                {isValidBase64(base64Image) ? (
                  <img
                    src={base64Image}
                    alt={`League Image ${index + 1}`}
                    style={imgStyle}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'red', fontSize: '16px' }}>
                    Invalid image format
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', fontSize: '16px' }}>
            No images to display
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
