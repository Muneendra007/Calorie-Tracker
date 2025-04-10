
import { FoodItem, CalorieRecord } from "@/types";

// Sample database of common foods and their calorie content per serving
const foodDatabase: Record<string, number> = {
  // Breakfast items
  "egg": 70,
  "boiled egg": 70,
  "fried egg": 90,
  "bread": 80,
  "toast": 80,
  "cereal": 120,
  "oatmeal": 150,
  "pancake": 175,
  "waffle": 200,
  "bagel": 250,
  "dosa": 120,
  "idli": 40,
  "paratha": 150,
  "poha": 130,
  
  // Proteins
  "chicken": 165,
  "chicken breast": 165,
  "fish": 150,
  "salmon": 180,
  "tuna": 120,
  "beef": 250,
  "steak": 250,
  "pork": 200,
  "tofu": 80,
  "paneer": 100,
  
  // Vegetables
  "salad": 50,
  "broccoli": 30,
  "spinach": 20,
  "kale": 30,
  "carrot": 40,
  "potato": 160,
  "sweet potato": 120,
  "corn": 90,
  
  // Fruits
  "apple": 80,
  "banana": 105,
  "orange": 65,
  "grape": 3,
  "strawberry": 4,
  "blueberry": 1,
  "mango": 130,
  
  // Fast foods
  "pizza": 285,
  "burger": 350,
  "hamburger": 350,
  "cheeseburger": 400,
  "fries": 220,
  "french fries": 220,
  "hot dog": 320,
  "taco": 210,
  "burrito": 400,
  
  // Snacks
  "chips": 150,
  "potato chips": 150,
  "cookie": 50,
  "chocolate": 150,
  "cake": 300,
  "ice cream": 130,
  
  // Drinks
  "soda": 140,
  "coke": 140,
  "pepsi": 140,
  "coffee": 5,
  "tea": 2,
  "milk": 120,
  "juice": 110,
  "orange juice": 110,
  "apple juice": 115,
  "beer": 150,
  "wine": 120,
  
  // Common dishes
  "pasta": 320,
  "rice": 200,
  "fried rice": 350,
  "sandwich": 300,
  "soup": 180,
  "salad": 100,
  "noodles": 300,
  "biryani": 400,
  "curry": 350,
  "dal": 150,
  "samosa": 140
};

export const extractFoodItems = (text: string): FoodItem[] => {
  // This is a simple implementation that would be replaced by Gemini API parsing
  const items: FoodItem[] = [];
  const words = text.toLowerCase().split(' ');
  
  // First, try to find quantity + food pairs
  const quantityRegex = /(\d+)/;
  
  for (let i = 0; i < words.length; i++) {
    // Check if the current word is a number
    const quantityMatch = words[i].match(quantityRegex);
    
    if (quantityMatch) {
      const quantity = parseInt(quantityMatch[0], 10);
      
      // Look ahead to find the food item
      if (i + 1 < words.length) {
        const potentialFood = words[i + 1];
        const potentialFoodPlural = potentialFood.endsWith('s') ? potentialFood.slice(0, -1) : potentialFood;
        
        // Check if the next word is a food
        if (foodDatabase[potentialFood] || foodDatabase[potentialFoodPlural]) {
          const foodName = foodDatabase[potentialFood] ? potentialFood : potentialFoodPlural;
          items.push({
            name: foodName,
            calories: foodDatabase[foodName],
            quantity: quantity
          });
          i++; // Skip the next word since we've processed it
          continue;
        }
        
        // Try 2-word food items
        if (i + 2 < words.length) {
          const twoWordFood = `${potentialFood} ${words[i + 2]}`;
          if (foodDatabase[twoWordFood]) {
            items.push({
              name: twoWordFood,
              calories: foodDatabase[twoWordFood],
              quantity: quantity
            });
            i += 2; // Skip the next two words
            continue;
          }
        }
      }
    }
    
    // Check if the current word is a food
    if (foodDatabase[words[i]]) {
      items.push({
        name: words[i],
        calories: foodDatabase[words[i]],
        quantity: 1  // Default quantity
      });
      continue;
    }
    
    // Try 2-word foods without explicit quantity
    if (i + 1 < words.length) {
      const twoWordFood = `${words[i]} ${words[i + 1]}`;
      if (foodDatabase[twoWordFood]) {
        items.push({
          name: twoWordFood,
          calories: foodDatabase[twoWordFood],
          quantity: 1  // Default quantity
        });
        i++; // Skip the next word
      }
    }
  }
  
  return items;
};

export const calculateTotalCalories = (foods: FoodItem[]): number => {
  return foods.reduce((total, food) => {
    return total + (food.calories * food.quantity);
  }, 0);
};

export const generateResponse = (foods: FoodItem[], dailyGoal?: number): string => {
  if (foods.length === 0) {
    return "I couldn't identify any food items. Could you please be more specific?";
  }
  
  const totalCalories = calculateTotalCalories(foods);
  
  let response = `I tracked ${foods.length} item${foods.length > 1 ? 's' : ''} for you:\n\n`;
  
  foods.forEach(food => {
    response += `• ${food.quantity} ${food.name} (${food.calories * food.quantity} calories)\n`;
  });
  
  response += `\nTotal calories: ${totalCalories}`;
  
  if (dailyGoal) {
    const remainingCalories = dailyGoal - totalCalories;
    if (remainingCalories >= 0) {
      response += `\nYou have ${remainingCalories} calories remaining for your daily goal of ${dailyGoal}.`;
    } else {
      response += `\nYou've exceeded your daily goal of ${dailyGoal} by ${Math.abs(remainingCalories)} calories.`;
    }
    
    // Add healthy suggestions
    if (foods.some(f => f.name === "burger" || f.name === "pizza" || f.name === "fries")) {
      response += "\n\nTry replacing high-calorie fast food with healthier alternatives like grilled chicken with vegetables or a hearty salad with lean protein.";
    } else if (foods.some(f => f.name.includes("cake") || f.name.includes("cookie") || f.name === "ice cream")) {
      response += "\n\nFor sweet cravings, consider fruit-based desserts like baked apples or a small bowl of berries for fewer calories and more nutrients.";
    }
  }
  
  return response;
};

// Function to get nutritional advice based on food choices
export const getHealthyAlternative = (foods: FoodItem[]): string => {
  // This would be replaced by Gemini API responses
  const highCalorieFoods = foods.filter(food => (food.calories * food.quantity) > 300);
  
  if (highCalorieFoods.length > 0) {
    const food = highCalorieFoods[0];
    switch (food.name) {
      case "burger":
        return "Instead of a burger, try a grilled chicken sandwich with lots of veggies for fewer calories and more nutrients.";
      case "pizza":
        return "Consider making a cauliflower crust pizza loaded with vegetables for a lower-calorie option than traditional pizza.";
      case "fries":
      case "french fries":
        return "Baked sweet potato fries are a healthier alternative to regular fries with more fiber and vitamins.";
      case "pasta":
        return "Try zucchini noodles or spaghetti squash instead of regular pasta for a lower-carb, lower-calorie meal.";
      case "ice cream":
        return "Frozen yogurt or a smoothie bowl can satisfy your sweet tooth with fewer calories than ice cream.";
      default:
        return "Try incorporating more vegetables and lean proteins into your meals for better nutritional balance.";
    }
  }
  
  return "";
};

// Save calorie data to local storage
export const saveCalorieData = (foodItems: FoodItem[]): void => {
  const today = new Date().toISOString().split('T')[0];
  const existingData = localStorage.getItem('calorieData');
  let calorieData: Record<string, CalorieRecord> = {};
  
  if (existingData) {
    calorieData = JSON.parse(existingData);
  }
  
  if (calorieData[today]) {
    // Append to today's data
    calorieData[today].foods = [...calorieData[today].foods, ...foodItems];
    calorieData[today].totalCalories = calculateTotalCalories(calorieData[today].foods);
  } else {
    // Create new entry for today
    calorieData[today] = {
      id: today,
      date: new Date(),
      foods: foodItems,
      totalCalories: calculateTotalCalories(foodItems)
    };
  }
  
  localStorage.setItem('calorieData', JSON.stringify(calorieData));
};

// Get calorie data from local storage
export const getCalorieData = (): Record<string, CalorieRecord> => {
  const data = localStorage.getItem('calorieData');
  return data ? JSON.parse(data) : {};
};

// Get today's total calories
export const getTodayCalories = (): number => {
  const today = new Date().toISOString().split('T')[0];
  const data = getCalorieData();
  return data[today]?.totalCalories || 0;
};

// Save user goal
export const saveUserGoal = (goal: UserGoal): void => {
  localStorage.setItem('userGoal', JSON.stringify(goal));
};

// Get user goal
export const getUserGoal = (): UserGoal | null => {
  const goal = localStorage.getItem('userGoal');
  return goal ? JSON.parse(goal) : null;
};
