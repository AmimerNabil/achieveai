import { BarChart3, Clock, CheckCircle2, Target } from 'lucide-react';

interface AnalyticsProps {
    totalTasks: number;
    completedTasks: number;
    totalTime: number;
    productivity: number;
}

export default function Analytics({ totalTasks, completedTasks, totalTime, productivity }: AnalyticsProps) {
    const stats = [
        {
            icon: <Target className="w-6 h-6 text-blue-500" />,
            label: 'Total Tasks',
            value: totalTasks,
        },
        {
            icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
            label: 'Completed',
            value: completedTasks,
        },
        {
            icon: <Clock className="w-6 h-6 text-purple-500" />,
            label: 'Total Time',
            value: `${totalTime}h`,
        },
        {
            icon: <BarChart3 className="w-6 h-6 text-orange-500" />,
            label: 'Productivity',
            value: `${productivity}%`,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
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
    );
}
