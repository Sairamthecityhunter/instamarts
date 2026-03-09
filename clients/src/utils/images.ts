/**
 * Images utility file
 * Centralized location for image paths, constants, and image-related utilities
 */

// Image paths - Update these with your actual image paths
export const images = {
    // Logo and branding
    logo: '/images/logo.png',
    logoDark: '/images/logo-dark.png',
    
    // Category icons
    categories: {
      beauty: '/images/beauty.png',
      grocery: '/images/grocery.png',
      stationery: '/images/stationery.png',
      fruitsVegetables: '/images/fruitsVegetables.png',
      outdoor: '/images/outdoor.png',
      household: '/images/household.png',
      snacks: '/images/snacks.png',
      dairy: '/images/dairy.png',
      roastery: '/images/roastery.png',
      fishery: '/images/fishery.png',
      bakery: '/images/bakery.png',
      delicatessen: '/images/delicatessen.png',
      butchery: '/images/butchery.png',
    },
    
    // Placeholder images
    placeholder: {
      product: '/images/placeholder/product.png',
      avatar: '/images/placeholder/avatar.png',
      banner: '/images/placeholder/banner.png',
    },
    
    // Hero and banners
    hero: {
      main: '/images/hero/main.jpg',
      grocery: '/images/hero/grocery.jpg',
      fresh: '/images/hero/fresh.jpg',
    },
    
    // Icons
    icons: {
      cart: '/images/icons/cart.svg',
      search: '/images/icons/search.svg',
      user: '/images/icons/user.svg',
    },
  };
  
  /**
   * Get image path with fallback
   * @param path - Image path
   * @param fallback - Fallback image path if original doesn't exist
   * @returns Image path or fallback
   */
  export const getImagePath = (path: string, fallback?: string): string => {
    return path || fallback || images.placeholder.product;
  };
  
  /**
   * Get category image
   * @param categoryId - Category ID
   * @returns Category image path
   */
  export const getCategoryImage = (categoryId: string): string => {
    const categoryMap: { [key: string]: string } = {
      'beauty-cosmetics': images.categories.beauty,
      'grocery': images.categories.grocery,
      'stationery': images.categories.stationery,
      'fruits-vegetables': images.categories.fruitsVegetables,
      'outdoor': images.categories.outdoor,
      'household': images.categories.household,
      'snacks-refreshments': images.categories.snacks,
      'dairy': images.categories.dairy,
      'roastery': images.categories.roastery,
      'fishery': images.categories.fishery,
      'bakery': images.categories.bakery,
      'delicatessen': images.categories.delicatessen,
      'butchery': images.categories.butchery,
    };
    
    return categoryMap[categoryId] || images.placeholder.product;
  };
  
  /**
   * Preload image
   * @param src - Image source path
   * @returns Promise that resolves when image is loaded
   */
  export const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  };
  
  /**
   * Preload multiple images
   * @param srcs - Array of image source paths
   * @returns Promise that resolves when all images are loaded
   */
  export const preloadImages = (srcs: string[]): Promise<void[]> => {
    return Promise.all(srcs.map(preloadImage));
  };
  
  export default images;
  