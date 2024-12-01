import './App.css'
import { Task } from './types';
import { useState } from 'react';



const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    priority: 'high',
    dueDate: '2024-03-20',
    category: 'work',
    isCompleted: false,
    isTimerRunning: false,
    timeSpent: 45,
    estimatedTime: 60,
  },
  {
    id: '2',
    title: 'Review team presentations',
    priority: 'medium',
    dueDate: '2024-03-21',
    category: 'work',
    isCompleted: true,
    isTimerRunning: false,
    timeSpent: 30,
    estimatedTime: 45,
  },
  {
    id: '3',
    title: 'Update documentation',
    priority: 'low',
    dueDate: '2024-03-22',
    category: 'work',
    isCompleted: false,
    isTimerRunning: false,
    timeSpent: 15,
    estimatedTime: 30,
  },
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tasks, setTasks] = useState(initialTasks)
  const [editingTask, setEditingTask] = useState<Task | null>(null);


  const handleCreateTask = (taskData: Omit<Task, 'id' | 'isCompleted' | 'isTimerRunning' | 'timeSpent'>) => {
    const newTask: Task = {
      ...taskData,
      id: editingTask?.id || Date.now().toString(),
      isCompleted: editingTask?.isCompleted || false,
      isTimerRunning: false,
      timeSpent: editingTask?.timeSpent || 0,
    };

    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? newTask : task));
      setEditingTask(null);
    } else {
      setTasks([newTask, ...tasks]);
    }
  };

  return (
    <>
    </>
  )
}

export default App
