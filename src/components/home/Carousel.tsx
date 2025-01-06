'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    id: 1,
    image: '/images/banner1.jpg',
    title: 'Exquisite Jewelry',
    description: 'Unique Design, Masterful Craftsmanship',
  },
  {
    id: 2,
    image: '/images/banner2.jpg',
    title: 'Luxury Experience',
    description: 'Adding Elegance to Your Life',
  },
  {
    id: 3,
    image: '/images/banner3.jpg',
    title: 'Perfect Gifts',
    description: 'For Your Special Moments',
  },
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isHovered]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div 
      className="relative h-[650px] mt-16 rounded-2xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div className="relative h-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              index === currentSlide
                ? 'opacity-100 translate-x-0 scale-100'
                : 'opacity-0 translate-x-full scale-95'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover transition-transform duration-700 scale-105"
                priority={index === 0}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/20" />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h2 
                  className={`text-6xl font-serif mb-6 transition-all duration-700 delay-100
                    ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                  {slide.title}
                </h2>
                <p 
                  className={`text-xl font-light tracking-wide mb-8 transition-all duration-700 delay-200
                    ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                  {slide.description}
                </p>
                <Button
                  variant="outline"
                  className={`border-white/30 hover:border-white/60 text-white hover:bg-white/10 
                    transition-all duration-700 delay-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]
                    ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                  Explore Collection
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20
            hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20
            hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              index === currentSlide 
                ? 'w-8 bg-white' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
        <div 
          className="h-full bg-white/40 transition-all duration-[5000ms] ease-linear"
          style={{ 
            width: isHovered ? '0%' : '100%',
            transitionProperty: 'width',
          }}
        />
      </div>
    </div>
  );
} 