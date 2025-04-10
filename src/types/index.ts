
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

export interface FoodItem {
  name: string;
  calories: number;
  quantity: number;
  unit?: string;
}

export interface CalorieRecord {
  id: string;
  date: Date;
  totalCalories: number;
  foods: FoodItem[];
}

export interface UserGoal {
  dailyCalorieTarget: number;
}
