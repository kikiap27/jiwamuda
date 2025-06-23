import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, CheckCircle2, Circle, Trophy, Clock, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGoals } from '@/hooks/useGoals';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const GoalSaya: React.FC = () => {
  const { goals, loading, createGoal, toggleTask } = useGoals();
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGoal = async () => {
    if (!newGoalTitle.trim()) return;
    
    setIsCreating(true);
    try {
      await createGoal(newGoalTitle.trim(), newGoalDescription.trim());
      setNewGoalTitle('');
      setNewGoalDescription('');
      setShowAddGoal(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleTask = async (taskId: string, goalId: string) => {
    await toggleTask(taskId, goalId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="p-4 pb-20 min-h-screen bg-gradient-to-br from-lifeguide-cream to-lifeguide-light-blue flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">🎯</div>
          <p>Memuat goal kamu...</p>
        </div>
      </div>
    );
  }

  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const totalTasks = goals.reduce((sum, goal) => sum + goal.tasks.length, 0);
  const completedTasks = goals.reduce((sum, goal) => sum + goal.tasks.filter(task => task.is_completed).length, 0);

  return (
    <div className="p-4 pb-20 min-h-screen bg-gradient-to-br from-lifeguide-cream to-lifeguide-light-blue">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Target className="w-6 h-6 text-lifeguide-blue mr-2" />
          <h1 className="text-xl font-bold text-lifeguide-blue">Goal Saya</h1>
        </div>
        
        {/* Enhanced Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="lifeguide-shadow bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold">{goals.length}</div>
              <div className="text-xs opacity-90">Total Goal</div>
            </CardContent>
          </Card>
          <Card className="lifeguide-shadow bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold">{completedTasks}</div>
              <div className="text-xs opacity-90">Tugas Selesai</div>
            </CardContent>
          </Card>
          <Card className="lifeguide-shadow bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold">{totalTasks - completedTasks}</div>
              <div className="text-xs opacity-90">Tugas Tersisa</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4 mb-6">
        {goals.map((goal, index) => {
          const completedTasksCount = goal.tasks.filter(task => task.is_completed).length;
          const progress = goal.tasks.length > 0 ? Math.round((completedTasksCount / goal.tasks.length) * 100) : 0;
          
          return (
            <Card key={goal.id} className="lifeguide-shadow animate-slide-up bg-white" style={{animationDelay: `${index * 0.1}s`}}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-lifeguide-blue flex items-center">
                      {progress === 100 && <Trophy className="w-5 h-5 mr-2 text-yellow-500" />}
                      {goal.title}
                    </CardTitle>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={progress} className="h-3" />
                    {progress === 100 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full opacity-20 animate-pulse"></div>
                    )}
                  </div>
                </div>
              </CardHeader>
              {goal.tasks.length > 0 && (
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-1 text-lifeguide-blue" />
                      Tugas yang Dibuat AI:
                    </h4>
                    {goal.tasks.map((task) => (
                      <div key={task.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="flex items-start space-x-3">
                          <button 
                            onClick={() => handleToggleTask(task.id, goal.id)}
                            className="mt-1"
                          >
                            {task.is_completed ? (
                              <CheckCircle2 className="text-green-500 w-5 h-5" />
                            ) : (
                              <Circle className="text-muted-foreground w-5 h-5 hover:text-lifeguide-blue transition-colors" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-medium ${task.is_completed ? 'line-through text-muted-foreground' : 'text-gray-800'}`}>
                                {task.title}
                              </span>
                              {task.due_date && (
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {new Date(task.due_date).toLocaleDateString('id-ID')}
                                </div>
                              )}
                            </div>
                            {task.description && (
                              <p className={`text-xs ${task.is_completed ? 'text-muted-foreground' : 'text-gray-600'} mb-2`}>
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-2">
                              {/* Difficulty badge would be shown if we had that data */}
                              <Badge variant="outline" className="text-xs">
                                📝 AI Generated
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Enhanced Add New Goal */}
      <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-lifeguide-blue to-lifeguide-teal hover:from-lifeguide-teal hover:to-lifeguide-blue mb-4 h-12 text-base font-semibold">
            <Plus className="w-5 h-5 mr-2" />
            Tambah Goal Baru dengan AI
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-lifeguide-blue" />
              Tambah Goal Baru
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Apa goal yang ingin kamu capai? *</label>
              <Input
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Contoh: Masuk ITB, Belajar Python, Lancar Bahasa Inggris"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Deskripsi detail (opsional)</label>
              <Textarea
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                placeholder="Jelaskan lebih detail tentang goal ini, target waktu, atau alasan kenapa penting..."
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start space-x-2">
                <Zap className="w-5 h-5 text-lifeguide-blue mt-0.5" />
                <div>
                  <h4 className="font-medium text-lifeguide-blue text-sm mb-1">AI akan membantu kamu!</h4>
                  <p className="text-sm text-gray-600">
                    Setelah kamu buat goal, AI akan otomatis memecahnya menjadi tugas-tugas kecil yang mudah dicapai dengan timeline yang realistis.
                  </p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleCreateGoal} 
              className="w-full bg-gradient-to-r from-lifeguide-blue to-lifeguide-teal hover:from-lifeguide-teal hover:to-lifeguide-blue"
              disabled={isCreating || !newGoalTitle.trim()}
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  AI sedang membuat tugas...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Buat Goal & Generate Tugas AI
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {goals.length === 0 && (
        <Card className="gradient-card lifeguide-shadow">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-800 mb-2">Mulai Perjalananmu!</h3>
            <p className="text-sm text-gray-600 mb-4">
              Belum ada goal yang dibuat. AI akan membantu memecah goal besar menjadi langkah-langkah kecil yang mudah dicapai!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Motivational Message */}
      {goals.length > 0 && (
        <Card className="gradient-card lifeguide-shadow bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">✨</div>
            <p className="text-sm text-gray-700 font-medium">
              "Dengan bantuan AI, setiap goal besar bisa dipecah menjadi langkah-langkah kecil yang mudah dicapai!"
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Progress kamu: {completedTasks}/{totalTasks} tugas selesai 🚀
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalSaya;