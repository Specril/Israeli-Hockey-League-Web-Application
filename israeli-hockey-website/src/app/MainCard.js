import React from 'react';
import { Carousel } from 'antd';

// Helper function to check if a string is a base64 image
const isBase64Image = (str) => {
  return typeof str === 'string' && str.startsWith("data:image/");
};

const CarouselComponent = ({ data = [] }) => {
  const carouselStyle = {
    marginBottom: '40px',
    width: '100%',
    margin: '0 auto',
  };

  const imgStyle = {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
  };

  return (
    <div className="carousel-container">
      <Carousel autoplay style={carouselStyle} dots={true} arrows={true}>
        {data.length > 0 ? (
          data.map((item, index) => (
            isBase64Image(item) ? (
              <div key={index}>
                <img
                  src={item}
                  alt={`League Image ${index + 1}`}
                  className="carousel-image"
                  style={imgStyle}
                />
              </div>
            ) : (
              <div key={index}>Invalid image format</div>
            )
          ))
        ) : (
          <div>No images to display</div>
        )}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
