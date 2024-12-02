import { X, Clock, Calendar, Repeat, Timer, Edit } from 'lucide-react';
import { Task } from '../types';

interface TaskDetailsProps {
    task: Task;
    onClose: () => void;
    onEdit: (task: Task) => void;
}

export default function TaskDetails({ task, onClose, onEdit }: TaskDetailsProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="space-y-4">
                    <div className="flex justify-between items-start mt-4">
                        <h2 className="text-xl font-semibold">{task.title}</h2>
                        <button
                            onClick={() => onEdit(task)}
                            className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700"
                        >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-600">
                            <Timer className="w-4 h-4" />
                            <span>{task.estimatedTime} minutes estimated</span>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{task.timeSpent} minutes spent</span>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-600">
                            <Repeat className="w-4 h-4" />
                            <span>{task.repetition}</span>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                            <p className="text-gray-600">{task.description || 'No description provided.'}</p>
                        </div>

                        <div className="flex space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'}`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {task.category}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
