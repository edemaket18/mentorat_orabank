 import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { Checkbox } from '@components/layout/Checkbox';
import { toast } from 'sonner';
import { getMyTasks, toggleTask, InternTask } from '@api/intern.api';

const InternTasks: React.FC = () => {
  const [tasks, setTasks] = useState<InternTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTasks().then(setTasks).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id: string) => {
    try {
      const updated = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      toast.success('Tâche mise à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la tâche');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mes tâches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : (
            <>
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between border rounded-md p-4"
                >
                  <div>
                    <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Attribuée le {new Date(task.assignedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Checkbox checked={task.completed} onCheckedChange={() => handleToggle(task._id)} />
                </div>
              ))}

              {tasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">Aucune tâche attribuée pour le moment.</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InternTasks;