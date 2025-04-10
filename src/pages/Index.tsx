
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import Dashboard from '@/components/Dashboard'; 
import Sidebar from '@/components/Sidebar';

const Index = () => {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState('chat');
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  return (
    <div className="h-screen flex flex-col bg-sage-light">
      <div className="flex-1 flex relative overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out absolute md:relative z-10 h-full ${
            isMobile ? 'w-3/4' : 'w-64'
          } shrink-0`}
        >
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col bg-white">
          {!showSidebar && isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 z-20"
              onClick={toggleSidebar}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
          
          {showSidebar && isMobile && (
            <div 
              className="absolute inset-0 bg-black/50 z-0"
              onClick={toggleSidebar}
            />
          )}
          
          {activeTab === 'chat' ? (
            <ChatInterface onToggleSidebar={toggleSidebar} />
          ) : (
            <Dashboard />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
