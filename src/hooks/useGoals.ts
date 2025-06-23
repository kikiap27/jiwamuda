import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: string;
  target_date: string;
  created_at: string;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
  due_date: string;
  goal_id: string;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchGoals = async () => {
    if (!user) return;
    
    try {
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;

      const goalsWithTasks = await Promise.all(
        (goalsData || []).map(async (goal) => {
          const { data: tasksData } = await supabase
            .from('tasks')
            .select('*')
            .eq('goal_id', goal.id)
            .order('created_at', { ascending: true });

          return {
            ...goal,
            tasks: tasksData || []
          };
        })
      );

      setGoals(goalsWithTasks);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Gagal memuat goal');
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (title: string, description: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          title,
          description,
          target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) throw error;

      // Generate AI tasks using edge function
      const response = await supabase.functions.invoke('generate-goal-tasks', {
        body: { goalTitle: title, goalId: data.id }
      });

      if (response.error) {
        console.error('Error generating tasks:', response.error);
      }

      await fetchGoals();
      toast.success('Goal berhasil dibuat!');
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Gagal membuat goal');
    }
  };

  const toggleTask = async (taskId: string, goalId: string) => {
    try {
      const task = goals.find(g => g.id === goalId)?.tasks.find(t => t.id === taskId);
      if (!task) return;

      const { error } = await supabase
        .from('tasks')
        .update({ 
          is_completed: !task.is_completed,
          completed_at: !task.is_completed ? new Date().toISOString() : null
        })
        .eq('id', taskId);

      if (error) throw error;

      await fetchGoals();
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Gagal mengupdate task');
    }
  };

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  return {
    goals,
    loading,
    createGoal,
    toggleTask,
    refetch: fetchGoals
  };
};