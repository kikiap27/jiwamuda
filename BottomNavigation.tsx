
import React from 'react';
import { Home, Brain, Target, MessageCircle, Star } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'tes-minat', label: 'Tes Minat', icon: Brain },
    { id: 'goal-saya', label: 'Goal Saya', icon: Target },
    { id: 'asisten-ai', label: 'Asisten AI', icon: MessageCircle },
    { id: 'role-model', label: 'Role Model', icon: Star },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-50 shadow-lg">
      <div className="flex justify-around items-center py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-3 min-w-[60px] transition-all duration-200 ${
                isActive 
                  ? 'text-blue-600 transform scale-110' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className={`p-1 rounded-full transition-all duration-200 ${
                isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}>
                <Icon size={20} />
              </div>
              <span className={`text-xs mt-1 font-medium ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-blue-600 rounded-full mt-1 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
