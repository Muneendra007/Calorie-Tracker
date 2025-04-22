
import { FoodItem } from '@/types';

export const searchFoodItems = async (query: string): Promise<FoodItem[]> => {
  throw new Error('Food database API not configured. Please provide your preferred food database API (like USDA, Nutritionix, or Edamam) and API key.');
};
