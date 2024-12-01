import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/auth";
import { Layout, PlusCircle } from "lucide-react";
import Analytics from "../components/Analytics";
import TaskCalendar from "../components/TaskCalendar";
import TaskDetails from "../components/TaskDetails";
import TaskFilters from "../components/TaskFilters";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns';
import { Task } from "../types";
import TaskService from "../services/tasks";


export default function Home() {
    const navigate = useNavigate();

    const [info, setInfo] = useState<string | null>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                navigate("/login");
                return;
            } else {
                setInfo(user.displayName)

                try {
                    const fetchedTasks = await TaskService.getAllTasks();
                    setTasks(fetchedTasks);
                } catch (error) {
                    console.error('Failed to fetch tasks:', error);
                } finally {
                    setTimeout(() => {
                        setLoading(false);
                    }, 300)
                }
            }
        });
        return () => unsubscribe();
    }, [navigate]);


    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('');
    const [timeFrame, setTimeFrame] = useState('week');
    const [sortBy, setSortBy] = useState('dueDate');
    const [hideCompleted, setHideCompleted] = useState(true);
    const [editTask, setEditTask] = useState<Task | undefined>();

    const handleAddTask = async (taskData: Omit<Task, 'id' | 'isCompleted' | 'isTimerRunning' | 'timeSpent'>) => {
        const newTask: Task = {
            ...taskData,
            isCompleted: false,
            isTimerRunning: false,
            timeSpent: 0
        };

        try {
            const createdTask = await TaskService.createTask(newTask);
            setTasks((prevTasks) => [...prevTasks, createdTask]);
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const handleEditTask = async (taskData: Omit<Task, 'id' | 'isCompleted' | 'isTimerRunning' | 'timeSpent'>) => {
        try {
            let task = tasks.filter(task => task._id === editTask?._id).at(0)

            await TaskService.updateTask(task?._id, {
                title: taskData.title,
                description: taskData.description,
                dueDate: taskData.dueDate,
                category: taskData.category,
                priority: taskData.priority,
                repetition: taskData.repetition,
                estimatedTime: taskData.estimatedTime
            });

            setTasks(tasks.map(task =>
                task._id === editTask?._id ? { ...task, ...taskData } : task
            ));
        } catch (e) {
            console.log(e)
        }
    };

    const handleToggleComplete = async (taskId: string) => {
        try {
            let task = tasks.filter(task => task._id === taskId).at(0)
            await TaskService.updateTask(taskId, {
                isCompleted: !task?.isCompleted
            });
            setTasks(tasks.map(task =>
                task._id === taskId ? { ...task, isCompleted: !task.isCompleted, isTimerRunning: false } : task
            ));
        } catch (e) {
            console.log(e)
        }

    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
    };

    const handleTimeUpdate = async (taskId: string, timeSpent: number) => {
        try {
            await TaskService.updateTask(taskId, {
                timeSpent: timeSpent
            });

            setTasks(tasks.map(task =>
                task._id === taskId ? { ...task, timeSpent } : task
            ));
        } catch (e) {
            console.log(e)
        }
    };

    const getFilteredTasks = () => {
        let filtered = [...tasks];

        if (hideCompleted) {
            filtered = filtered.filter(task => !task.isCompleted);
        }

        if (selectedDate) {
            filtered = filtered.filter(task => {
                const taskDate = new Date(task.dueDate);
                const formattedSelectedDate = format(selectedDate, 'MM/dd/yyyy');
                const formattedTaskDate = format(taskDate, 'MM/dd/yyyy');
                return formattedSelectedDate === formattedTaskDate;
            });
        } else if (timeFrame) {
            const now = new Date();
            filtered = filtered.filter(task => {
                const taskDate = new Date(task.dueDate);
                switch (timeFrame) {
                    case 'today':
                        return format(taskDate, 'MM/dd/yyyy') === format(now, 'MM/dd/yyyy');
                    case 'week':
                        const weekStart = startOfWeek(now);
                        const weekEnd = endOfWeek(now);
                        return isWithinInterval(taskDate, { start: weekStart, end: weekEnd });
                    case 'month':
                        return format(taskDate, 'MM/yyyy') === format(now, 'MM/yyyy');
                    default:
                        return true;
                }
            });
        }

        if (category) {
            filtered = filtered.filter(task => task.category === category);
        }

        if (priority) {
            filtered = filtered.filter(task => task.priority === priority);
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'priority':
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                case 'estimatedTime':
                    return (a.estimatedTime || 0) - (b.estimatedTime || 0);
                default:
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
        });

        return filtered;
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setTimeFrame('');
    };

    const handleToggleTimer = async (taskId: string, action: 'start' | 'pause' | 'stop' | 'restart') => {
        try {

            if (action == "restart" || action == "stop") {
                await TaskService.updateTask(taskId, {
                    timeSpent: 0
                });
            }

            setTasks(tasks.map(task => {
                if (task._id === taskId) {
                    switch (action) {
                        case 'start':
                        case 'restart':
                            return {
                                ...task,
                                isTimerRunning: true,
                                timeSpent: action === 'restart' ? 0 : task.timeSpent
                            };
                        case 'pause':
                            return { ...task, isTimerRunning: false };
                        case 'stop':
                            return { ...task, isTimerRunning: false, timeSpent: 0 };
                        default:
                            return task;
                    }
                }
                return task;
            }));
        } catch (e) {
            console.log(e)
        }
    };

    const clearFilters = () => {
        setCategory('');
        setPriority('');
        setTimeFrame('week');
        setSortBy('dueDate');
        setSelectedDate(null);
    };

    const filteredTasks = getFilteredTasks();

    if (loading) return <p> loading </p>

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Layout className="w-8 h-8 mr-2" />
                        {info}'s Task Manager
                    </h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Add Task
                    </button>
                </div>

                <div className="mb-8">
                    <Analytics tasks={tasks} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <TaskFilters
                            selectedDate={selectedDate}
                            category={category}
                            priority={priority}
                            timeFrame={timeFrame}
                            sortBy={sortBy}
                            hideCompleted={hideCompleted}
                            onCategoryChange={setCategory}
                            onPriorityChange={setPriority}
                            onTimeFrameChange={setTimeFrame}
                            onSortChange={setSortBy}
                            onHideCompletedToggle={() => setHideCompleted(!hideCompleted)}
                            onClearFilters={clearFilters}
                        />

                        <TaskList
                            tasks={filteredTasks}
                            onToggleTimer={handleToggleTimer}
                            onToggleComplete={handleToggleComplete}
                            onTaskClick={handleTaskClick}
                            onTimeUpdate={handleTimeUpdate}
                        />
                    </div>
                    <div>
                        <TaskCalendar tasks={tasks} onDateClick={handleDateClick} />
                    </div>
                </div>

                {isModalOpen && (
                    <TaskModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditTask(undefined);
                        }}
                        onSubmit={editTask ? handleEditTask : handleAddTask}
                        editTask={editTask}
                    />
                )}

                {selectedTask && (
                    <TaskDetails
                        task={selectedTask}
                        onClose={() => setSelectedTask(null)}
                        onEdit={(task) => {
                            setEditTask(task);
                            setIsModalOpen(true);
                            setSelectedTask(null);
                        }}
                    />
                )}
            </div>
        </div>
    )
}
