import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const heroSlides = [
  {
    image: '/images/hero-banner-2.png',
    title: 'Komali Sarees',
    subtitle: 'Panorama of Indian Handlooms',
    // No CTA for the banner slide
    imageClass: 'object-contain bg-white'
  },
  {
    image: '/images/carousel-shop-interior.jpg',
    title: 'Visit Our Store',
    subtitle: 'Experience the elegance in person',
    cta: 'Get Directions',
    imageClass: 'object-cover'
  },
  {
    image: '/images/carousel-saree-toy.jpg',
    title: 'Exquisite Craftsmanship',
    subtitle: 'Handpicked traditional weaves',
    cta: 'Shop Now',
    imageClass: 'object-cover'
  },
  {
    image: '/images/carousel-shop-shelves.jpg',
    title: 'Vast Collection',
    subtitle: 'A wide range of colors and fabrics',
    cta: 'View All',
    imageClass: 'object-cover'
  },
  {
    image: '/images/carousel-saree-checked.jpg',
    title: 'Timeless Classics',
    subtitle: 'Authentic designs for every occasion',
    cta: 'Shop Classics',
    imageClass: 'object-cover'
  }
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      scale: 1.1,
      opacity: 1,
      zIndex: 1
    }),
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
      zIndex: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30, mass: 1 },
        scale: { duration: 0.8, ease: "easeOut" }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      scale: 0.95,
      opacity: 0,
      zIndex: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 }
      }
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentSlide((prev) => (prev + newDirection + heroSlides.length) % heroSlides.length);
  };

  const nextSlide = () => paginate(1);
  const prevSlide = () => paginate(-1);
  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-white group">
      <AnimatePresence mode='popLayout'>
        <motion.div
          key={currentSlide}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }} // Slow, smooth cross-fade
        >
          <div className="absolute inset-0 bg-white overflow-hidden">
            <motion.img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className={`w-full h-full ${heroSlides[currentSlide].imageClass || 'object-cover'}`}
              initial={{ scale: 1.1 }} // Start slightly zoomed in
              animate={{ scale: 1 }}   // Zoom out slowly to normal
              transition={{ duration: 7, ease: "easeOut" }} // Long duration for subtle movement
            />
            {/* Overlay */}
            {heroSlides[currentSlide].imageClass?.includes('object-cover') && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
            )}
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center pointer-events-auto">
              <div className="max-w-2xl overflow-hidden">
                {currentSlide !== 0 && (
                  <>
                    <motion.h1
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                      className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 text-white tracking-tight"
                    >
                      {heroSlides[currentSlide].title}
                    </motion.h1>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                      className="text-lg md:text-xl mb-8 text-white/90 font-light tracking-wide"
                    >
                      {heroSlides[currentSlide].subtitle}
                    </motion.p>
                  </>
                )}

                {heroSlides[currentSlide].cta && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
                  >
                    <Button
                      size="lg"
                      className={`h-12 px-8 text-base font-medium backdrop-blur-md border transition-all duration-300 ${
                        currentSlide === 0
                          ? 'bg-primary text-primary-foreground border-primary mt-[300px] hover:bg-primary/90'
                          : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                      }`}
                      data-testid="button-hero-cta"
                    >
                      {heroSlides[currentSlide].cta}
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-20">
        <Button
          size="icon"
          variant="ghost"
          className={`h-12 w-12 rounded-full backdrop-blur-md transition-all duration-300 border pointer-events-auto opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 ${
            currentSlide === 0 
              ? 'bg-white/20 hover:bg-white/40 text-black border-black/10' 
              : 'bg-black/20 hover:bg-black/40 text-white border-white/20'
          }`}
          onClick={prevSlide}
          data-testid="button-hero-prev"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className={`h-12 w-12 rounded-full backdrop-blur-md transition-all duration-300 border pointer-events-auto opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 ${
            currentSlide === 0 
              ? 'bg-white/20 hover:bg-white/40 text-black border-black/10' 
              : 'bg-black/20 hover:bg-black/40 text-white border-white/20'
          }`}
          onClick={nextSlide}
          data-testid="button-hero-next"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Progress Bar & Dots */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center gap-4">
        {/* Dots */}
        <div className="flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? (currentSlide === 0 ? 'bg-black w-8' : 'bg-white w-8')
                  : (currentSlide === 0 ? 'bg-black/20 w-2 hover:bg-black/40' : 'bg-white/30 w-2 hover:bg-white/50')
              }`}
              data-testid={`button-hero-dot-${index}`}
            />
          ))}
        </div>
        
        {/* Progress Line */}
        <div className="w-full h-1 bg-gray-200/20 absolute bottom-0 left-0">
           <motion.div 
             className={`h-full ${currentSlide === 0 ? 'bg-black/20' : 'bg-white/40'}`}
             initial={{ width: "0%" }}
             animate={{ width: "100%" }}
             key={currentSlide}
             transition={{ duration: 6, ease: "linear" }}
           />
        </div>
      </div>
    </div>
  );
}
