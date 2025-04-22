
import { FoodItem } from '@/types';

const USDA_API_KEY = "AIzaSyCW4eLsMLDimw_OlAWd23TnWZ-mSAGbQq4";
const USDA_API_ENDPOINT = "https://api.nal.usda.gov/fdc/v1";

export const searchFoodItems = async (query: string): Promise<FoodItem[]> => {
  try {
    // Search for foods in USDA database
    const response = await fetch(
      `${USDA_API_ENDPOINT}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch from USDA API');
    }

    const data = await response.json();
    
    // Transform USDA food items to our FoodItem format
    return data.foods.slice(0, 5).map((food: any) => ({
      name: food.description,
      calories: Math.round(food.foodNutrients.find((n: any) => n.nutrientName === "Energy")?.value || 0),
      quantity: 1,
      unit: food.servingSize ? `${food.servingSize}${food.servingSizeUnit}` : 'serving'
    }));
  } catch (error) {
    console.error('Error searching food items:', error);
    return [];
  }
};
