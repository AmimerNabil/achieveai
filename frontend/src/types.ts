export interface Task {
  id: string;
  title: string;
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
