import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, FoodItem } from '@/types';
import { generateResponse, saveCalorieData, getUserGoal } from '@/utils/calorieUtils';
import { searchFoodItems } from '@/utils/foodApi';
import { v4 as uuidv4 } from 'uuid';

interface ChatInterfaceProps {
  onToggleSidebar: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onToggleSidebar }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your calorie tracking assistant. You can tell me what you ate, and I'll help you track your calories. What did you have today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add loading message for bot
    const loadingMessage: Message = {
      id: uuidv4(),
      content: '',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Search for food items using the food database API
      const foodItems = await searchFoodItems(input);
      
      const userGoal = getUserGoal();
      
      // Generate a human-readable response
      const response = generateResponse(foodItems, userGoal?.dailyCalorieTarget);
      
      // Save the food items to storage if any were found
      if (foodItems.length > 0) {
        saveCalorieData(foodItems);
      }
      
      // Replace loading message with actual response
      setMessages(prev => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex(msg => msg.id === loadingMessage.id);
        
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = {
            id: loadingMessage.id,
            content: response,
            sender: 'bot',
            timestamp: new Date()
          };
        }
        
        return newMessages;
      });
    } catch (error) {
      // Handle errors
      setMessages(prev => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex(msg => msg.id === loadingMessage.id);
        
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = {
            id: loadingMessage.id,
            content: "Please provide a food database API key to enable food tracking.",
            sender: 'bot',
            timestamp: new Date()
          };
        }
        
        return newMessages;
      });
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-center flex-1">Calorie Chat</h1>
        <div className="w-8" /> {/* Empty div for balanced spacing */}
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.isLoading ? (
                <div className="chat-bubble-bot">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              ) : (
                <div className={message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                  {message.content.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < message.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Tell me what you ate..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} className="bg-teal-light hover:bg-teal">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
