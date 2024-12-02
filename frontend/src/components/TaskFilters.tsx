import { Eye, EyeOff } from 'lucide-react';

interface TaskFiltersProps {
    selectedDate: Date | null;
    category: string;
    priority: string;
    timeFrame: string;
    sortBy: string;
    hideCompleted: boolean;
    onCategoryChange: (category: string) => void;
    onPriorityChange: (priority: string) => void;
    onTimeFrameChange: (timeFrame: string) => void;
    onSortChange: (sortBy: string) => void;
    onHideCompletedToggle: () => void;
    onClearFilters: () => void;
}

export default function TaskFilters({
    selectedDate,
    category,
    priority,
    timeFrame,
    sortBy,
    hideCompleted,
    onCategoryChange,
    onPriorityChange,
    onTimeFrameChange,
    onSortChange,
    onHideCompletedToggle,
    onClearFilters,
}: TaskFiltersProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onHideCompletedToggle}
                        className="p-2 rounded-md hover:bg-gray-100"
                        title={hideCompleted ? 'Show completed tasks' : 'Hide completed tasks'}
                    >
                        {hideCompleted ? (
                            <EyeOff className="w-5 h-5 text-gray-500" />
                        ) : (
                            <Eye className="w-5 h-5 text-gray-500" />
                        )}
                    </button>
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                        Clear filters
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <select
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">All Categories</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="shopping">Shopping</option>
                    <option value="health">Health</option>
                    <option value="education">Education</option>
                </select>

                <select
                    value={priority}
                    onChange={(e) => onPriorityChange(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                </select>

                <select
                    value={timeFrame}
                    onChange={(e) => onTimeFrameChange(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="dueDate">Sort by Due Date</option>
                    <option value="priority">Sort by Priority</option>
                    <option value="estimatedTime">Sort by Time to Complete</option>
                </select>
            </div>

            {selectedDate && (
                <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    Showing tasks for {selectedDate.toLocaleDateString()}
                </div>
            )}
        </div>
    );
}
