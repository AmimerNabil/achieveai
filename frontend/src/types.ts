export interface Task {
    _id?: string;
    title: string;
    user: string;
    description?: string;
    priority: "high" | "medium" | "low";
    dueDate: string;
    category?: string;
    repetition?: string;
    estimatedTime?: number;
    isCompleted: boolean;
    isTimerRunning: boolean;
    timeSpent: number;
}
