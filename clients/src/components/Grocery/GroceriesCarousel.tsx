import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import CurrencyConverter from '../International/CurrencyConverter';

interface GroceryProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  unit?: string;
  brand?: string;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
}

interface GroceriesCarouselProps {
  title: string;
  subtitle?: string;
  products: GroceryProduct[];
  viewAllLink?: string;
  viewAllCount?: number;
  scrollToRight?: boolean;
  marquee?: boolean;
  marqueeSpeed?: number; // pixels per second
  marqueeDirection?: 'left' | 'right'; // direction for marquee scrolling
}

const GroceriesCarousel: React.FC<GroceriesCarouselProps> = ({
  title,
  subtitle,
  products,
  viewAllLink = '/groceries',
  viewAllCount,
  scrollToRight = false,
  marquee = false,
  marqueeSpeed = 30,
  marqueeDirection = 'right'
}) => {
  const dispatch = useDispatch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const marqueeAnimationRef = useRef<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(scrollToRight);
  const [canScrollRight, setCanScrollRight] = useState(!scrollToRight);
  
  // Duplicate products for seamless marquee loop
  const displayProducts = marquee ? [...products, ...products] : products;

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < maxScroll - 10);
    }
  };

  // Marquee animation effect
  useEffect(() => {
    if (marquee && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      let lastTime = performance.now();
      let scrollPosition = 0;
      let animationId: number | null = null;
      let initialized = false;

      const animate = (currentTime: number) => {
        if (!scrollContainerRef.current) return;
        
        // Initialize scroll position for left direction
        if (!initialized && marqueeDirection === 'left') {
          const firstItem = container.querySelector('.flex-shrink-0') as HTMLElement;
          if (firstItem) {
            const itemWidth = firstItem.offsetWidth + 16;
            const totalWidth = itemWidth * products.length;
            scrollPosition = totalWidth;
            container.scrollLeft = totalWidth;
            initialized = true;
          }
        }
        
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        // Calculate the width of one set of products dynamically
        const firstItem = container.querySelector('.flex-shrink-0') as HTMLElement;
        if (firstItem) {
          const itemWidth = firstItem.offsetWidth + 16; // item width + gap (gap-4 = 16px)
          const totalWidth = itemWidth * products.length;
          
          // Calculate scroll increment based on speed (pixels per second)
          const scrollIncrement = (marqueeSpeed * deltaTime) / 1000;
          
          // Scroll based on direction
          if (marqueeDirection === 'right') {
            scrollPosition += scrollIncrement;
            // Reset when we've scrolled through one set of products
            if (scrollPosition >= totalWidth) {
              scrollPosition = scrollPosition - totalWidth;
            }
          } else {
            // Left direction - scroll backwards
            scrollPosition -= scrollIncrement;
            // Reset when we've scrolled backwards through one set
            if (scrollPosition <= 0) {
              scrollPosition = totalWidth; // Reset to start from right again
            }
          }
          
          container.scrollLeft = scrollPosition;
        }
        
        animationId = requestAnimationFrame(animate);
        marqueeAnimationRef.current = animationId;
      };

      // Wait a bit for DOM to be ready
      const startTimeout = setTimeout(() => {
        animationId = requestAnimationFrame(animate);
        marqueeAnimationRef.current = animationId;
      }, 100);

      return () => {
        clearTimeout(startTimeout);
        if (animationId !== null) {
          cancelAnimationFrame(animationId);
        }
        if (marqueeAnimationRef.current !== null) {
          cancelAnimationFrame(marqueeAnimationRef.current);
        }
      };
    }
  }, [marquee, marqueeSpeed, marqueeDirection, products.length]);

  useEffect(() => {
    if (scrollToRight && scrollContainerRef.current && !marquee) {
      const scrollToRightEdge = () => {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          // Force a reflow to ensure dimensions are calculated
          void container.offsetHeight;
          const maxScroll = container.scrollWidth - container.clientWidth;
          // Only scroll if there's actually content to scroll
          if (maxScroll > 0) {
            // Use scrollTo for better browser compatibility
            container.scrollTo({
              left: maxScroll,
              behavior: 'auto' // Use 'auto' instead of 'smooth' for immediate scroll
            });
            // Also set scrollLeft directly as fallback
            container.scrollLeft = maxScroll;
            // Update scroll state after scroll
            setTimeout(() => {
              checkScrollability();
            }, 50);
          }
        }
      };

      // Use multiple attempts to ensure it works after DOM and images are ready
      // Start with requestAnimationFrame for immediate execution
      requestAnimationFrame(() => {
        scrollToRightEdge();
      });

      const timeout1 = setTimeout(scrollToRightEdge, 100);
      const timeout2 = setTimeout(scrollToRightEdge, 300);
      const timeout3 = setTimeout(scrollToRightEdge, 600);
      const timeout4 = setTimeout(scrollToRightEdge, 1200);

      // Also listen for image loads
      const imageLoadHandlers: Array<{ img: HTMLImageElement; handlers: { load: () => void; error: () => void } }> = [];
      const images = scrollContainerRef.current?.querySelectorAll('img');
      if (images && images.length > 0) {
        let loadedCount = 0;
        const totalImages = images.length;
        const onImageLoad = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setTimeout(scrollToRightEdge, 100);
          }
        };
        images.forEach(img => {
          if (img.complete) {
            onImageLoad();
          } else {
            const handlers = {
              load: onImageLoad,
              error: onImageLoad
            };
            img.addEventListener('load', handlers.load);
            img.addEventListener('error', handlers.error);
            imageLoadHandlers.push({ img, handlers });
          }
        });
      }

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        clearTimeout(timeout4);
        // Clean up image event listeners
        imageLoadHandlers.forEach(({ img, handlers }) => {
          img.removeEventListener('load', handlers.load);
          img.removeEventListener('error', handlers.error);
        });
      };
    }
  }, [scrollToRight, products, marquee]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current && !marquee) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      setTimeout(checkScrollability, 300);
    }
  };

  const handleAddToCart = (product: GroceryProduct) => {
    dispatch(addToCart({
      product: {
        id: product.id,
        name: product.name,
        description: product.brand ? `${product.brand} ${product.name}` : product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: 'grocery',
        brand: product.brand || '',
        unit: product.unit || '1 unit',
        inStock: product.inStock !== false,
        rating: product.rating || 4.5,
        reviewCount: product.reviewCount || 0,
        tags: []
      },
      quantity: 1
    }));
    toast.success(`${product.name} added to cart`);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{title}</h2>
          {subtitle && (
            <p className="text-gray-600 text-sm md:text-base">{subtitle}</p>
          )}
        </div>
        {viewAllCount !== undefined && (
          <Link
            to={viewAllLink}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm md:text-base"
          >
            View all ({viewAllCount}+)
            <FiChevronRight className="w-5 h-5" />
          </Link>
        )}
      </div>

      {/* Products Carousel */}
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && !marquee && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition-colors border border-gray-200"
            aria-label="Scroll left"
          >
            <FiChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={marquee ? undefined : checkScrollability}
          className={`flex gap-4 overflow-x-auto pb-4 scrollbar-hide ${marquee ? 'cursor-default' : ''}`}
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
          }}
        >
          {displayProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="flex-shrink-0 w-48 md:w-56 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 md:h-48 object-cover"
                />
                <button
                  onClick={() => handleAddToCart(product)}
                  className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm shadow-md"
                >
                  + Add
                </button>
                {product.originalPrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
                {product.inStock === false && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-3 py-1 rounded text-xs font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>
                {product.unit && (
                  <p className="text-xs text-gray-600 mb-2">{product.unit}</p>
                )}
                
                {/* Price */}
                <div className="flex items-center gap-2 mb-2">
                  <CurrencyConverter 
                    inrPrice={product.price} 
                    className="text-lg font-bold text-gray-900" 
                  />
                  {product.originalPrice && (
                    <CurrencyConverter 
                      inrPrice={product.originalPrice} 
                      className="text-sm text-gray-500 line-through" 
                    />
                  )}
                </div>

                {/* Rating (if available) */}
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-gray-600">{product.rating}</span>
                    {product.reviewCount && (
                      <span className="text-xs text-gray-400">({product.reviewCount})</span>
                    )}
                  </div>
                )}

                {/* Stock Status */}
                {product.inStock !== false && (
                  <p className="text-xs text-green-600 mt-1">Many in stock</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && !marquee && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition-colors border border-gray-200"
            aria-label="Scroll right"
          >
            <FiChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default GroceriesCarousel;

