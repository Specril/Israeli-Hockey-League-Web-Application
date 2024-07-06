import React from 'react';
import { Carousel } from 'antd';

const CarouselComponent = () => {
  const carouselStyle = {
    marginBottom: '40px', // Increased marginBottom for more space
    width: '100%', // Adjust the width as needed
    height: '400px', // Adjust the height as needed
    margin: '0 auto', // Center the carousel
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Ensures the image covers the entire carousel area
  };

  return (
    <Carousel autoplay style={carouselStyle} dots={true} arrows={true} adaptiveHeight={true}>
      <div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Argentin_player_during_2007_rink_hockey_world_championship.jpg/1280px-Argentin_player_during_2007_rink_hockey_world_championship.jpg"
          alt="League Image 1"
          style={imgStyle}
        />
      </div>
      <div>
        <img
          src="https://www.worldskate.org/images/medium/20180723_jw_g11_40.JPG"
          alt="League Image 2"
          style={imgStyle}
        />
      </div>
      <div>
        <img
          src="https://www.worldskate.org/images/medium/20180723_jw_g11_40.JPG"
          alt="League Image 3"
          style={imgStyle}
        />
      </div>
    </Carousel>
  );
};

export default CarouselComponent;
