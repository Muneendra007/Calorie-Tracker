
import { FoodItem, CalorieRecord, UserGoal } from "@/types";

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
  }
  
  return response;
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
    calorieData[today].foods = [...calorieData[today].foods, ...foodItems];
    calorieData[today].totalCalories = calculateTotalCalories(calorieData[today].foods);
  } else {
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
