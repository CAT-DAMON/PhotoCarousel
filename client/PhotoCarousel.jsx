import React, { useState } from 'react';
import { ServiceContainer } from './styled-components.jsx'

const PhotoCarousel = (props) => {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  }
  return (
    <div>
        <img className="carousel-image" src={props.products[0].photos[index]} onClick={props.handleShowModal}/>
    </div>
  )
}

export default PhotoCarousel;
