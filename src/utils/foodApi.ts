
import { FoodItem } from '@/types';

// Temporary hard-coded food items to use as fallback when API fails
const FALLBACK_FOOD_ITEMS: Record<string, FoodItem[]> = {
  "apple": [
    { name: "Apple, raw", calories: 52, quantity: 1, unit: "medium (3\" dia)" },
    { name: "Apple, with skin", calories: 95, quantity: 1, unit: "large (3-1/4\" dia)" }
  ],
  "banana": [
    { name: "Banana, raw", calories: 105, quantity: 1, unit: "medium (7\" to 7-7/8\" long)" },
    { name: "Banana, ripe", calories: 121, quantity: 1, unit: "large (8\" to 8-7/8\" long)" }
  ],
  "chicken": [
    { name: "Chicken breast, grilled", calories: 165, quantity: 100, unit: "g" },
    { name: "Chicken thigh, roasted", calories: 209, quantity: 100, unit: "g" }
  ],
  "rice": [
    { name: "White rice, cooked", calories: 130, quantity: 100, unit: "g" },
    { name: "Brown rice, cooked", calories: 112, quantity: 100, unit: "g" }
  ],
  "bread": [
    { name: "White bread", calories: 75, quantity: 1, unit: "slice" },
    { name: "Whole wheat bread", calories: 81, quantity: 1, unit: "slice" }
  ],
  "egg": [
    { name: "Egg, whole, cooked", calories: 78, quantity: 1, unit: "large" },
    { name: "Egg white, raw", calories: 17, quantity: 1, unit: "large" }
  ],
  "beef": [
    { name: "Ground beef, 80% lean", calories: 215, quantity: 100, unit: "g" },
    { name: "Beef steak, sirloin", calories: 176, quantity: 100, unit: "g" }
  ],
  "potato": [
    { name: "Potato, baked", calories: 163, quantity: 1, unit: "medium (2-1/4\" to 3-1/4\" dia)" },
    { name: "Sweet potato, baked", calories: 103, quantity: 100, unit: "g" }
  ],
  "milk": [
    { name: "Milk, 2% fat", calories: 122, quantity: 1, unit: "cup" },
    { name: "Milk, whole", calories: 149, quantity: 1, unit: "cup" }
  ],
  "yogurt": [
    { name: "Yogurt, plain, low fat", calories: 154, quantity: 1, unit: "cup" },
    { name: "Greek yogurt, plain", calories: 100, quantity: 100, unit: "g" }
  ]
};

const USDA_API_KEY = "AIzaSyCW4eLsMLDimw_OlAWd23TnWZ-mSAGbQq4";
const USDA_API_ENDPOINT = "https://api.nal.usda.gov/fdc/v1";

export const searchFoodItems = async (query: string): Promise<FoodItem[]> => {
  try {
    // First try to search with the USDA API
    const response = await fetch(
      `${USDA_API_ENDPOINT}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      // If the API call fails, throw an error
      const errorData = await response.json();
      console.error('USDA API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to fetch from USDA API');
    }

    const data = await response.json();
    
    // If we got results from the API, transform and return them
    if (data.foods && data.foods.length > 0) {
      return data.foods.slice(0, 5).map((food: any) => ({
        name: food.description,
        calories: Math.round(food.foodNutrients.find((n: any) => n.nutrientName === "Energy")?.value || 0),
        quantity: 1,
        unit: food.servingSize ? `${food.servingSize}${food.servingSizeUnit}` : 'serving'
      }));
    }
    
    // If no results from API, throw error
    throw new Error('No food items found in API');
    
  } catch (error) {
    console.error('Error searching food items:', error);
    
    // Try to find fallback data
    const lowerQuery = query.toLowerCase();
    
    // Check if we have fallback data for any word in the query
    for (const key of Object.keys(FALLBACK_FOOD_ITEMS)) {
      if (lowerQuery.includes(key)) {
        console.log(`Using fallback data for "${key}"`);
        return FALLBACK_FOOD_ITEMS[key];
      }
    }
    
    // If no matches in our fallback data, return empty array
    return [];
  }
};
