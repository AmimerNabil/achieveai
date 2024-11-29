import React from 'react';
import { Clock, CheckCircle2, Circle, AlertCircle, Timer, Pause, Square, RotateCcw } from 'lucide-react';
import { Task } from '../types';
import TaskTimer from './TaskTimer';

interface TaskListProps {
    tasks: Task[];
    onToggleTimer: (taskId: string, action: 'start' | 'pause' | 'stop' | 'restart') => void;
    onToggleComplete: (taskId: string) => void;
    onTaskClick: (task: Task) => void;
    onTimeUpdate: (taskId: string, timeSpent: number) => void;
}

export default function TaskList({ tasks, onToggleTimer, onToggleComplete, onTaskClick, onTimeUpdate }: TaskListProps) {
    const getPriorityIcon = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'medium':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'low':
                return <AlertCircle className="w-5 h-5 text-green-500" />;
            default:
                return null;
        }
    };

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    return (
        <div className="space-y-4">
            {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No tasks match your current filters
                </div>
            ) : (
                tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`bg-white rounded-lg shadow-sm p-4 flex items-center justify-between transition-all cursor-pointer hover:shadow-md ${task.isCompleted ? 'opacity-75' : ''
                            }`}
                        onClick={() => onTaskClick(task)}
                    >
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleComplete(task.id);
                                }}
                                className="focus:outline-none"
                            >
                                {task.isCompleted ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                ) : (
                                    <Circle className="w-6 h-6 text-gray-400" />
                                )}
                            </button>
                            <div>
                                <h3 className={`font-medium ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                    {task.title}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                    {getPriorityIcon(task.priority)}
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                        {task.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            {task.isTimerRunning && (
                                <TaskTimer
                                    isRunning={task.isTimerRunning}
                                    estimatedTime={task.estimatedTime || 0}
                                    timeSpent={task.timeSpent}
                                    onTimeUpdate={(timeSpent) => onTimeUpdate(task.id, timeSpent)}
                                />
                            )}
                            <div className="flex flex-col items-end">
                                <div className="flex space-x-1">
                                    {!task.isCompleted && (
                                        <>
                                            {!task.isTimerRunning && task.timeSpent === 0 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onToggleTimer(task.id, 'start');
                                                    }}
                                                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                                    title="Start Timer"
                                                >
                                                    <Timer className="w-5 h-5" />
                                                </button>
                                            )}
                                            {task.isTimerRunning && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onToggleTimer(task.id, 'pause');
                                                    }}
                                                    className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
                                                    title="Pause Timer"
                                                >
                                                    <Pause className="w-5 h-5" />
                                                </button>
                                            )}
                                            {!task.isTimerRunning && task.timeSpent > 0 && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onToggleTimer(task.id, 'start');
                                                        }}
                                                        className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                                        title="Resume Timer"
                                                    >
                                                        <Timer className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onToggleTimer(task.id, 'restart');
                                                        }}
                                                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                                        title="Restart Timer"
                                                    >
                                                        <RotateCcw className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onToggleTimer(task.id, 'stop');
                                                        }}
                                                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                                        title="Stop Timer"
                                                    >
                                                        <Square className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                                <span className="text-xs text-gray-500 mt-1">
                                    {formatTime(task.timeSpent)} / {formatTime(task.estimatedTime || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}