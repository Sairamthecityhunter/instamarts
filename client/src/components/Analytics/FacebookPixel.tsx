import { useEffect } from 'react';

// Facebook Pixel Configuration
const FACEBOOK_PIXEL_ID = process.env.REACT_APP_FACEBOOK_PIXEL_ID || 'your-facebook-pixel-id';

// Initialize Facebook Pixel
export const initFacebookPixel = () => {
  if (typeof window !== 'undefined' && FACEBOOK_PIXEL_ID !== 'your-facebook-pixel-id') {
    // Facebook Pixel Code
    (function(f: any, b: Document, e: string, v: string, n?: any, t?: HTMLScriptElement, s?: Element) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      if (s && s.parentNode) {
        s.parentNode.insertBefore(t, s);
      }
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    (window as any).fbq('init', FACEBOOK_PIXEL_ID);
    (window as any).fbq('track', 'PageView');
  }
};

// Track custom events
export const trackFBEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, parameters);
  }
};

// Track purchase
export const trackFBPurchase = (value: number, currency: string) => {
  trackFBEvent('Purchase', { value, currency });
};

// Track add to cart
export const trackFBAddToCart = (value: number, currency: string, contentName: string) => {
  trackFBEvent('AddToCart', { 
    value, 
    currency, 
    content_name: contentName 
  });
};

// Track view content
export const trackFBViewContent = (contentName: string, contentCategory: string, value?: number) => {
  trackFBEvent('ViewContent', {
    content_name: contentName,
    content_category: contentCategory,
    value: value,
    currency: 'USD'
  });
};

// Track lead generation
export const trackFBLead = () => {
  trackFBEvent('Lead');
};

// Track registration
export const trackFBCompleteRegistration = () => {
  trackFBEvent('CompleteRegistration');
};

// React component to initialize Facebook Pixel
export const FacebookPixelTracker: React.FC = () => {
  useEffect(() => {
    initFacebookPixel();
  }, []);

  return null;
};
