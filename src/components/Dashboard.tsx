
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  getTodayCalories, 
  getCalorieData,
  getUserGoal,
  saveUserGoal
} from '@/utils/calorieUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface CalorieTarget {
  dailyCalorieTarget: number;
}

const Dashboard: React.FC = () => {
  const [todayCalories, setTodayCalories] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState<number | null>(null);
  const [inputGoal, setInputGoal] = useState('');
  const [weeklyData, setWeeklyData] = useState<{ name: string; calories: number }[]>([]);
  
  useEffect(() => {
    // Load current day's calories
    const currentCalories = getTodayCalories();
    setTodayCalories(currentCalories);
    
    // Load user's calorie goal
    const goal = getUserGoal();
    if (goal) {
      setCalorieGoal(goal.dailyCalorieTarget);
      setInputGoal(goal.dailyCalorieTarget.toString());
    }
    
    // Generate weekly data
    loadWeeklyData();
  }, []);
  
  const loadWeeklyData = () => {
    const calorieData = getCalorieData();
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
      
      weekData.push({
        name: dayName,
        calories: calorieData[dateStr]?.totalCalories || 0
      });
    }
    
    setWeeklyData(weekData);
  };
  
  const handleSaveGoal = () => {
    const goal: CalorieTarget = {
      dailyCalorieTarget: parseInt(inputGoal, 10)
    };
    
    saveUserGoal(goal);
    setCalorieGoal(goal.dailyCalorieTarget);
  };
  
  // Calculate percentage of goal reached
  const goalPercentage = calorieGoal ? Math.min(Math.round((todayCalories / calorieGoal) * 100), 100) : 0;
  
  // Progress circle data
  const progressData = [
    { name: 'Consumed', value: todayCalories },
    { name: 'Remaining', value: calorieGoal ? Math.max(calorieGoal - todayCalories, 0) : 0 }
  ];
  
  const COLORS = ['#4ECDC4', '#EFEFEF'];
  
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-teal-dark">Your Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      {progressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{todayCalories}</span>
                  <span className="text-sm text-muted-foreground">of {calorieGoal || '?'}</span>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-lg">
                  {calorieGoal ? (
                    <>
                      {todayCalories <= calorieGoal ? (
                        <span>{calorieGoal - todayCalories} calories remaining</span>
                      ) : (
                        <span className="text-coral">{todayCalories - calorieGoal} calories over goal</span>
                      )}
                    </>
                  ) : (
                    <span>Set a daily goal to track progress</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Daily Calorie Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Set daily calorie goal"
                  value={inputGoal}
                  onChange={(e) => setInputGoal(e.target.value)}
                />
                <Button 
                  onClick={handleSaveGoal}
                  className="bg-teal-light hover:bg-teal"
                >
                  Save
                </Button>
              </div>
              
              {calorieGoal && (
                <div className="text-center mt-4">
                  <p>Current daily goal: {calorieGoal} calories</p>
                  <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                    <div 
                      className={`h-2.5 rounded-full ${goalPercentage > 100 ? 'bg-coral' : 'bg-teal-light'}`}
                      style={{ width: `${Math.min(goalPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-1">
                    {goalPercentage}% of daily goal
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} calories`, 'Calories']} />
                <Bar dataKey="calories" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
