
import React from 'react';
import { Button } from "@/components/ui/button";
import { PieChart, MessageCircle, Info } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-full h-full bg-sage-light border-r flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-teal-dark">Calorie Tracker</h2>
      </div>
      
      <div className="flex flex-col p-2 space-y-2 flex-1">
        <Button
          variant={activeTab === 'chat' ? 'default' : 'ghost'}
          className={`justify-start ${activeTab === 'chat' ? 'bg-teal-light hover:bg-teal' : ''}`}
          onClick={() => onTabChange('chat')}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Chat
        </Button>
        
        <Button
          variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
          className={`justify-start ${activeTab === 'dashboard' ? 'bg-teal-light hover:bg-teal' : ''}`}
          onClick={() => onTabChange('dashboard')}
        >
          <PieChart className="mr-2 h-5 w-5" />
          Dashboard
        </Button>
      </div>
      
      <div className="p-4 border-t">
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-teal-dark shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p>12305873</p>
              <p>12326550</p>
              <p>12325746</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
