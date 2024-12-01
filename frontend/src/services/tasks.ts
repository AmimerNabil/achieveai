import { Task } from '../types';
import axiosInstance from '../utils/axios';

class TaskService {
    /**
     * Get all tasks for the logged-in user.
     */
    static async getAllTasks(): Promise<Task[]> {
        try {
            const response = await axiosInstance.get<Task[]>('/tasks');
            return response.data;
        } catch (error: any) {
            console.error('Error fetching tasks:', error.message);
            throw error;
        }
    }

    /**
     * Get a specific task by ID.
     * @param id - Task ID
     */
    static async getTaskById(id: string): Promise<Task> {
        try {
            const response = await axiosInstance.get<Task>(`/tasks/${id}`);
            return response.data;
        } catch (error: any) {
            console.error(`Error fetching task with ID ${id}:`, error.message);
            throw error;
        }
    }

    /**
     * Create a new task for the logged-in user.
     * @param task - Task data
     */
    static async createTask(task: Task): Promise<Task> {
        try {
            const response = await axiosInstance.post<Task>('/tasks', task);
            return response.data;
        } catch (error: any) {
            console.error('Error creating task:', error.message);
            throw error;
        }
    }

    /**
     * Update an existing task by ID.
     * @param id - Task ID
     * @param updates - Updated task data
     */
    static async updateTask(id: string | undefined, updates: Partial<Task>): Promise<Task> {


        try {
            if (!id) throw new Error("No id provided");
            const response = await axiosInstance.put<Task>(`/tasks/${id}`, updates);
            return response.data;
        } catch (error: any) {
            console.error(`Error updating task with ID ${id}:`, error.message);
            throw error;
        }
    }

    /**
     * Update the time spent on a task by ID.
     * @param id - Task ID
     * @param timeSpent - Updated time spent
     */
    static async updateTaskTime(id: string, timeSpent: number): Promise<Task> {
        try {
            const response = await axiosInstance.put<Task>(`/tasks/${id}/time`, { timeSpent });
            return response.data;
        } catch (error: any) {
            console.error(`Error updating time for task with ID ${id}:`, error.message);
            throw error;
        }
    }

    /**
     * Delete a task by ID.
     * @param id - Task ID
     */
    static async deleteTask(id: string): Promise<void> {
        try {
            await axiosInstance.delete(`/tasks/${id}`);
        } catch (error: any) {
            console.error(`Error deleting task with ID ${id}:`, error.message);
            throw error;
        }
    }
}

export default TaskService;



