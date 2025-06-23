import React, { useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import Beranda from './Beranda';
import TesMinat from './TesMinat';
import GoalSaya from './GoalSaya';
import AsistenAI from './AsistenAI';
import RoleModel from './RoleModel';

const Index = () => {
  const [activeTab, setActiveTab] = useState('beranda');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'beranda':
        return <Beranda onTabChange={setActiveTab} />;
      case 'tes-minat':
        return <TesMinat />;
      case 'goal-saya':
        return <GoalSaya />;
      case 'asisten-ai':
        return <AsistenAI />;
      case 'role-model':
        return <RoleModel />;
      default:
        return <Beranda onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderActiveTab()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;