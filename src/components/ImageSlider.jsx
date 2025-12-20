import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  {
    url: '/assets/images/dental-hero-9.jpg',
    title: 'Expert Clinical Consultation',
    description: 'Our dedicated specialists provide precise diagnostics and personalized care plans.'
  },
  {
    url: '/assets/images/dental-hero-10.jpg',
    title: 'Advanced Surgical Precision',
    description: 'State-of-the-art facilities for complex dental procedures with absolute comfort.'
  },
  {
    url: '/assets/images/dental-hero-1.jpg',
    title: 'Hospitality & Care',
    description: 'Experience a new standard of dental care where your comfort is our priority.'
  }
];

export const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, []);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="image-slider-container card glass">
      <div className="slider-wrapper">
        {images.map((slide, index) => (
          <div
            key={index}
            className={`slide-item ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.url})` }}
          >
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-controls">
        <button className="control-btn prev" onClick={prevSlide}>
          <ChevronLeft size={24} />
        </button>
        <button className="control-btn next" onClick={nextSlide}>
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="slider-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
