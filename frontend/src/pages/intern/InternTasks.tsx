import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { Checkbox } from '@components/layout/Checkbox';
import { Button } from '@components/common/Button';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignedDate: string;
}

const InternTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Préparer le rapport hebdomadaire',
      completed: false,
      assignedDate: '2025-07-15',
    },
    {
      id: '2',
      title: 'Participer à la réunion de suivi',
      completed: true,
      assignedDate: '2025-07-14',
    },
  ]);

  const toggleTask = (id: string) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
    toast.success('Tâche mise à jour');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mes tâches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between border rounded-md p-4"
            >
              <div>
                <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500">Attribuée le {task.assignedDate}</p>
              </div>
              <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
            </div>
          ))}

          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">Aucune tâche attribuée pour le moment.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InternTasks;
