
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, LogOut, TrendingUp, Target, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useGoals } from '@/hooks/useGoals';
import { Button } from '@/components/ui/button';

interface BerandaProps {
  onTabChange?: (tab: string) => void;
}

const Beranda: React.FC<BerandaProps> = ({ onTabChange }) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { goals } = useGoals();

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Selamat Pagi' : currentHour < 18 ? 'Selamat Siang' : 'Selamat Malam';
  
  const motivationalQuotes = [
    "Masa depan dimulai dari langkah kecil hari ini! 🌟",
    "Setiap usaha yang kamu lakukan tidak akan sia-sia 💪",
    "Kamu lebih kuat dari yang kamu pikirkan! 🚀",
    "Hari ini adalah kesempatan baru untuk berkembang 🌱",
    "Impianmu layak untuk diperjuangkan! ✨"
  ];
  
  const todayQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  
  // Get active goals with their progress
  const activeGoals = goals.filter(goal => goal.status === 'active').slice(0, 3);
  
  // Get today's tasks from all goals
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = goals.flatMap(goal => 
    goal.tasks.filter(task => task.due_date === today)
  ).slice(0, 4);

  const userName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Sobat';

  // Calculate overall progress
  const totalTasks = goals.reduce((sum, goal) => sum + goal.tasks.length, 0);
  const completedTasks = goals.reduce((sum, goal) => sum + goal.tasks.filter(task => task.is_completed).length, 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleGoToGoals = () => {
    if (onTabChange) {
      onTabChange('goal-saya');
    }
  };

  const handleGoToAI = () => {
    if (onTabChange) {
      onTabChange('asisten-ai');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with modern gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">
              {greeting}, {userName}! 👋
            </h1>
            <p className="text-blue-100 text-sm">
              Mari lihat progress hari ini
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={signOut}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
          >
            <LogOut size={16} />
          </Button>
        </div>

        {/* Progress Circle Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Progress Hari Ini</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray={`${overallProgress}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{overallProgress}%</span>
                    </div>
                  </div>
                  <div className="text-white">
                    <div className="flex items-center space-x-1 mb-1">
                      <Target className="w-4 h-4" />
                      <span className="text-sm">{activeGoals.length} Goals Aktif</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">{completedTasks} / {totalTasks} Tugas</span>
                    </div>
                  </div>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 -mt-4 pb-20">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-gradient-to-br from-orange-400 to-pink-500 border-0 shadow-lg">
            <CardContent className="p-4 text-center text-white">
              <div className="text-2xl font-bold mb-1">{todayTasks.length}</div>
              <div className="text-xs opacity-90">Tugas Hari Ini</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-400 to-blue-500 border-0 shadow-lg">
            <CardContent className="p-4 text-center text-white">
              <div className="text-2xl font-bold mb-1">{completedTasks}</div>
              <div className="text-xs opacity-90">Selesai</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-400 to-indigo-500 border-0 shadow-lg">
            <CardContent className="p-4 text-center text-white">
              <div className="text-2xl font-bold mb-1">{activeGoals.length}</div>
              <div className="text-xs opacity-90">Goals Aktif</div>
            </CardContent>
          </Card>
        </div>

        {/* Quote Card */}
        <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-0 shadow-md">
          <CardContent className="p-5">
            <div className="text-center">
              <div className="text-2xl mb-3">💡</div>
              <p className="text-gray-700 italic font-medium leading-relaxed">"{todayQuote}"</p>
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        {activeGoals.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Goal Dalam Progress
            </h2>
            <div className="space-y-3">
              {activeGoals.map((goal, index) => {
                const completedTasksCount = goal.tasks.filter(task => task.is_completed).length;
                const totalTasksCount = goal.tasks.length;
                const progress = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
                
                return (
                  <Card key={goal.id} className="border-0 shadow-md bg-white" style={{animationDelay: `${index * 0.1}s`}}>
                    <CardContent className="p-5">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-gray-800 flex-1">{goal.title}</h3>
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          {completedTasksCount}/{totalTasksCount}
                        </span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 mt-1 block">{progress}% selesai</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Today's Tasks */}
        {todayTasks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Tugas Hari Ini
            </h2>
            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-5">
                <div className="space-y-3">
                  {todayTasks.map((task, index) => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      {task.is_completed ? (
                        <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />
                      ) : (
                        <Circle className="text-gray-400 w-5 h-5 flex-shrink-0" />
                      )}
                      <span className={`flex-1 ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {activeGoals.length === 0 && (
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 mb-6">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">Mulai Perjalananmu!</h3>
              <p className="text-gray-600 text-sm">Belum ada goal aktif. Yuk mulai dengan membuat goal pertamamu!</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="border-0 shadow-lg cursor-pointer hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-500 to-purple-600 text-white"
            onClick={handleGoToGoals}
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🎯</div>
              <p className="font-semibold">Tambah Goal Baru</p>
              <p className="text-xs mt-1 opacity-80">Mulai perjalanan baru</p>
            </CardContent>
          </Card>
          <Card 
            className="border-0 shadow-lg cursor-pointer hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-500 to-teal-600 text-white"
            onClick={handleGoToAI}
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🤖</div>
              <p className="font-semibold">Chat dengan AI</p>
              <p className="text-xs mt-1 opacity-80">Dapatkan bantuan</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Beranda;
