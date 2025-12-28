"use client";

import { useEffect, useState } from "react";
import { getTasks, deleteTask, Task, updateTask } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

export function TaskList({ refreshKey }: { refreshKey: number }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshKey]);

  const handleDelete = async (id: string) => {
      await deleteTask(id);
      fetchTasks();
  };

  const handleToggle = async (task: Task) => {
      await updateTask(task.id, { is_completed: !task.is_completed });
      fetchTasks();
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
               <Checkbox 
                checked={task.is_completed} 
                onCheckedChange={() => handleToggle(task)}
               />
               <span className={task.is_completed ? "line-through text-gray-500" : ""}>
                 {task.title}
               </span>
            </div>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(task.id)}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
      {tasks.length === 0 && <p className="text-gray-500 text-center">No tasks found.</p>}
    </div>
  );
}