import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiUsers, FiShoppingCart } from 'react-icons/fi';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  ingredients: Array<{
    id: string;
    name: string;
    quantity: string;
    available: boolean;
  }>;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface RecipeSuggestionsProps {
  recipes: Recipe[];
  onAddIngredientsToCart?: (recipeId: string) => void;
}

const RecipeSuggestions: React.FC<RecipeSuggestionsProps> = ({
  recipes,
  onAddIngredientsToCart,
}) => {
  if (recipes.length === 0) {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recipe Suggestions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => {
            const availableCount = recipe.ingredients.filter(i => i.available).length;
            const availabilityPercentage = (availableCount / recipe.ingredients.length) * 100;

            return (
              <div key={recipe.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>

                  {/* Recipe Info */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiClock className="h-4 w-4" />
                      <span>{recipe.prepTime + recipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiUsers className="h-4 w-4" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>

                  {/* Ingredients Availability */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">Ingredients Available</span>
                      <span className="text-sm font-medium text-gray-900">
                        {availableCount}/{recipe.ingredients.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          availabilityPercentage === 100
                            ? 'bg-green-600'
                            : availabilityPercentage >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${availabilityPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      View Recipe
                    </Link>
                    {onAddIngredientsToCart && (
                      <button
                        onClick={() => onAddIngredientsToCart(recipe.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        <FiShoppingCart className="h-4 w-4" />
                        Add Ingredients
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecipeSuggestions;
