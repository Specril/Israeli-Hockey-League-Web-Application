"use client"
import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd';

const CarouselComponent = ({ data = [] }) => {
  const [carouselWidth, setCarouselWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setCarouselWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate carousel width
  const calculateCarouselWidth = () => {
    const cardWidth = 350; // Adjust this to the width of your cards
    const margin = 20; // Adjust this to the margin between cards
    return carouselWidth - 2 * (cardWidth + margin);
  };

  // Container style for the carousel
  const carouselStyle = {
    width: calculateCarouselWidth() + 'px', // Set calculated width
    height: '600px', // Adjust height based on your design
    margin: '0 auto',
  };

  // Style for images inside the carousel
  const imgStyle = {
    width: '100%', // Ensure image takes the full width of the carousel container
    height: '100%', // Ensure image takes the full height of the carousel container
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
