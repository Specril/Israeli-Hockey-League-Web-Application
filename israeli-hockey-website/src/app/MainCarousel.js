import React from 'react';
import { Carousel } from 'antd';

const CarouselComponent = ({ data = [] }) => {
  const carouselStyle = {
    marginBottom: '20px',
    width: '100%',
    height: '300px', // Adjust height based on your design
    margin: '0 auto',
  };

  const imgStyle = {
    width: '100%',
    height: '100%', // Ensure it fits the carousel container
    objectFit: 'cover',
  };

  // Function to validate if the image data is correctly formatted
  const isValidBase64 = (base64Image) => {
    return (
      base64Image.startsWith("data:image/jpeg;base64,") || 
      base64Image.startsWith("data:image/png;base64,")
    );
  };

  return (
    <div className="carousel-container">
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
