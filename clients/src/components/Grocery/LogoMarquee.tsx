import React, { useRef, useEffect } from 'react';

interface Logo {
  id: string;
  name: string;
  image?: string;
  url?: string;
}

interface LogoMarqueeProps {
  logos: Logo[];
  speed?: number; // pixels per second
  direction?: 'left' | 'right';
}

const LogoMarquee: React.FC<LogoMarqueeProps> = ({
  logos,
  speed = 40,
  direction = 'right'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (logos.length === 0 || !containerRef.current) return;

    const container = containerRef.current;
    let lastTime = performance.now();
    let scrollPosition = 0;
    let animationId: number | null = null;

    const animate = (currentTime: number) => {
      if (!containerRef.current) return;

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Calculate the width of one set of logos dynamically
      const firstItem = container.querySelector('.logo-item') as HTMLElement;
      if (firstItem) {
        const itemWidth = firstItem.offsetWidth + 24; // item width + gap (gap-6 = 24px)
        const totalWidth = itemWidth * logos.length;

        // Calculate scroll increment based on speed (pixels per second)
        const scrollIncrement = (speed * deltaTime) / 1000;
        
        if (direction === 'right') {
          scrollPosition += scrollIncrement;
          // Reset when we've scrolled through one set of logos
          if (scrollPosition >= totalWidth) {
            scrollPosition = scrollPosition - totalWidth;
          }
        } else {
          scrollPosition -= scrollIncrement;
          // Reset when we've scrolled backwards through one set
          if (scrollPosition <= -totalWidth) {
            scrollPosition = scrollPosition + totalWidth;
          }
        }

        container.scrollLeft = scrollPosition;
      }

      animationId = requestAnimationFrame(animate);
      animationRef.current = animationId;
    };

    // Wait a bit for DOM to be ready
    const startTimeout = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
      animationRef.current = animationId;
    }, 100);

    return () => {
      clearTimeout(startTimeout);
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [logos, speed, direction]);

  if (logos.length === 0) {
    return null;
  }

  // Duplicate logos for seamless marquee loop
  const displayLogos = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden">
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {displayLogos.map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            className="logo-item flex-shrink-0 flex items-center justify-center bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow min-w-[120px] h-20"
          >
            {logo.image ? (
              <img
                src={logo.image}
                alt={logo.name}
                className="max-h-12 max-w-full object-contain"
              />
            ) : (
              <span className="text-sm font-semibold text-gray-700 text-center">
                {logo.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoMarquee;

