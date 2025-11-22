import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage1 from '@assets/generated_images/Hero_image_burgundy_silk_saree_5a3119ca.png';
import heroImage2 from '@assets/generated_images/Hero_image_blue_designer_saree_63eab45b.png';
import heroImage3 from '@assets/generated_images/Hero_image_pink_cotton_saree_0efc3928.png';

const heroSlides = [
  {
    image: heroImage1,
    title: 'Silk Heritage Collection',
    subtitle: 'Timeless elegance in every weave',
    cta: 'Explore Collection'
  },
  {
    image: heroImage2,
    title: 'Designer Masterpieces',
    subtitle: 'Exquisite craftsmanship, modern aesthetics',
    cta: 'Shop Designer'
  },
  {
    image: heroImage3,
    title: 'Cotton Elegance',
    subtitle: 'Comfort meets traditional grace',
    cta: 'View Cotton Sarees'
  }
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
          
          <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 text-white">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                {slide.subtitle}
              </p>
              <Button
                size="lg"
                className="h-12 px-8 text-base font-medium bg-white/10 backdrop-blur-md border border-white/20 text-white hover-elevate active-elevate-2"
                data-testid="button-hero-cta"
              >
                {slide.cta}
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button
        size="icon"
        variant="ghost"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/20 backdrop-blur-sm transition-colors"
        onClick={prevSlide}
        data-testid="button-hero-prev"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/20 backdrop-blur-sm transition-colors"
        onClick={nextSlide}
        data-testid="button-hero-next"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover-elevate'
            }`}
            data-testid={`button-hero-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
