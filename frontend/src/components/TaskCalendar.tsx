import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Task } from '../types';

interface TaskCalendarProps {
    tasks: Task[];
    onDateClick: (value: Date, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function TaskCalendar({ tasks, onDateClick }: TaskCalendarProps) {
    const getTileContent = ({ date }: { date: Date }) => {
        const tasksForDate = tasks.filter(
            task => new Date(task.dueDate).toDateString() === date.toDateString()
        );

        if (tasksForDate.length === 0) return null;

        return (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                <div className="h-1 w-1 bg-indigo-500 rounded-full"></div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Task Calendar</h2>
            <Calendar
                onChange={(value, event) => onDateClick(value as Date, event)}
                tileContent={getTileContent}
                className="border-0 w-full"
            />
        </div>
    );
}
