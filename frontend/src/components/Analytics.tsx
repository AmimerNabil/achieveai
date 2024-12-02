import { useState } from 'react';
import { BarChart3, Clock, CheckCircle2, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import {
    startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay, eachDayOfInterval,
    eachHourOfInterval, format, isWithinInterval, isSameDay, isSameHour, parseISO
} from 'date-fns';
import { Task } from '../types';

interface AnalyticsProps {
    tasks: Task[];
}

type TimeRange = 'today' | 'week' | 'month' | 'custom';
type ChartMetric = 'tasks' | 'time';

export default function Analytics({ tasks }: AnalyticsProps) {

    const [timeRange, setTimeRange] = useState<TimeRange>('week');
    const [chartMetric, setChartMetric] = useState<ChartMetric>('tasks');
    const [customStartDate, setCustomStartDate] = useState<Date>(new Date());
    const [customEndDate, setCustomEndDate] = useState<Date>(new Date());

    const getDateRange = () => {
        const now = new Date();
        switch (timeRange) {
            case 'today':
                return { start: startOfDay(now), end: endOfDay(now) };
            case 'week':
                return { start: startOfWeek(now), end: endOfWeek(now) };
            case 'month':
                return { start: startOfMonth(now), end: endOfMonth(now) };
            case 'custom':
                return { start: startOfDay(customStartDate), end: endOfDay(customEndDate) };
        }
    };

    const getStats = () => {
        const { start, end } = getDateRange();
        const filteredTasks = tasks.filter(task => {
            const taskDate = parseISO(task.dueDate);
            return isWithinInterval(taskDate, { start, end });
        });

        return [
            {
                icon: <Target className="w-6 h-6 text-blue-500" />,
                label: 'Total Tasks',
                value: filteredTasks.length,
            },
            {
                icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
                label: 'Completed',
                value: filteredTasks.filter(t => t.isCompleted).length,
            },
            {
                icon: <Clock className="w-6 h-6 text-purple-500" />,
                label: 'Total Time',
                value: `${Math.round(filteredTasks.reduce((acc, t) => acc + t.timeSpent, 0) / 60)}h`,
            },
            {
                icon: <BarChart3 className="w-6 h-6 text-orange-500" />,
                label: 'Productivity',
                value: `${Math.round((filteredTasks.filter(t => t.isCompleted).length / filteredTasks.length) * 100 || 0)}%`,
            },
        ];
    };

    const getChartData = () => {
        const { start, end } = getDateRange();
        const intervals = timeRange === 'today'
            ? eachHourOfInterval({ start, end })
            : eachDayOfInterval({ start, end });

        return intervals.map(date => {
            const tasksInPeriod = tasks.filter(task => {
                const taskDate = parseISO(task.dueDate);
                return timeRange === 'today'
                    ? isSameHour(taskDate, date)
                    : isSameDay(taskDate, date);
            });

            return {
                date: timeRange === 'today'
                    ? format(date, 'HH:mm')
                    : format(date, 'MMM dd'),
                value: chartMetric === 'tasks'
                    ? tasksInPeriod.filter(t => t.isCompleted).length
                    : tasksInPeriod.reduce((acc, t) => acc + t.timeSpent, 0),
            };
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="custom">Custom Range</option>
                    </select>

                    {timeRange === 'custom' && (
                        <div className="flex items-center space-x-2">
                            <DatePicker
                                selected={customStartDate}
                                onChange={(date) => setCustomStartDate(date || new Date())}
                                maxDate={new Date()}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholderText="Start Date"
                            />
                            <span>to</span>
                            <DatePicker
                                selected={customEndDate}
                                onChange={(date) => setCustomEndDate(date || new Date())}
                                maxDate={new Date()}
                                minDate={customStartDate}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholderText="End Date"
                            />
                        </div>
                    )}
                </div>

                <select
                    value={chartMetric}
                    onChange={(e) => setChartMetric(e.target.value as ChartMetric)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="tasks">Tasks Completed</option>
                    <option value="time">Time Spent (minutes)</option>
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getStats().map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gray-50 rounded-full">{stat.icon}</div>
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {chartMetric === 'tasks' ? 'Tasks Completed' : 'Time Spent'} by {timeRange === 'today' ? 'Hour' : 'Day'}
                    </h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="value"
                                    fill="#6366f1"
                                    radius={[4, 4, 0, 0]}
                                    name={chartMetric === 'tasks' ? 'Tasks Completed' : 'Minutes Spent'}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
