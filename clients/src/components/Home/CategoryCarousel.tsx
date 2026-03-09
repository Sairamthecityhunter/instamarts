import React from 'react';

interface Category {
  id: string;
  name: string;
  image: string;
  icon: string;
  productCount: number;
}

interface CategoryCarouselProps {
  categories: Category[];
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ categories }) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {categories.map((category) => (
        <div key={category.id} className="text-center">
          <div className="w-16 h-16 mx-auto bg-primary-100 rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl">{category.icon}</span>
          </div>
          <p className="text-sm font-medium text-gray-900">{category.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryCarousel; 