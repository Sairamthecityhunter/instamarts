export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  isVeg: boolean;
  isAvailable: boolean;
  spiceLevel?: 'mild' | 'medium' | 'spicy';
  calories?: number;
  allergens?: string[];
  tags: string[];
  rating?: {
    average: number;
    count: number;
  };
  customizations?: {
    type: 'topping' | 'spice' | 'quantity' | 'addon';
    name: string;
    options: { name: string; price: number; description?: string }[];
  }[];
  availability?: {
    isAvailable: boolean;
    availableHours?: {
      start: string;
      end: string;
    };
  };
  frequentlyOrderedWith?: string[];
  recommendations?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  deliveryTime: string;
  costForTwo: number;
  image: string;
  isPureVeg: boolean;
  offers: string[];
  isOpen: boolean;
  location?: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  menuCategories: MenuCategory[];
  menu: MenuItem[];
}

export interface CustomizationOption {
  name: string;
  price: number;
  description?: string;
}

export interface Customization {
  type: 'topping' | 'spice' | 'quantity' | 'addon';
  name: string;
  options: CustomizationOption[];
}

export interface SelectedCustomizations {
  [key: string]: {
    [optionName: string]: boolean;
  };
}

export interface CartItemCustomization {
  name: string;
  selectedOptions: string[];
}

export interface CartItemWithCustomizations {
  customizations?: CartItemCustomization[];
  quantity: number;
  totalPrice: number;
} 