import { useEffect, useState } from "react";

interface TaskTimerProps {
    isRunning: boolean;
    estimatedTime: number;
    timeSpent: number;
    onTimeUpdate: (elapsedSeconds: number) => void;
}

export default function TaskTimer({
    isRunning,
    estimatedTime,
    timeSpent,
    onTimeUpdate,
}: TaskTimerProps) {
    const [timeLeft, setTimeLeft] = useState(estimatedTime * 60 - timeSpent * 60);
    const [audio] = useState(
        new Audio(
            "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
        )
    );

    useEffect(() => {
        let interval: number;

        // Store end time when starting or resuming
        if (isRunning) {
            localStorage.setItem(
                `timer-${estimatedTime}`,
                (Date.now() + timeLeft * 1000).toString()
            );
        }

        // Resume from stored time if exists
        const storedEndTime = localStorage.getItem(`timer-${estimatedTime}`);
        if (storedEndTime) {
            const remaining = Math.max(
                0,
                Math.floor((parseInt(storedEndTime) - Date.now()) / 1000)
            );
            setTimeLeft(remaining);
        }

        if (isRunning && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft((current) => {
                    const newTime = Math.max(0, current - 1);
                    const elapsedSeconds = estimatedTime * 60 - newTime;
                    onTimeUpdate(Math.floor(elapsedSeconds / 60));

                    if (newTime === 0) {
                        audio.play();
                        setTimeout(() => audio.pause(), 5000);
                        localStorage.removeItem(`timer-${estimatedTime}`);
                    }
                    return newTime;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRunning, estimatedTime, audio, timeLeft, onTimeUpdate, timeSpent]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <span className="font-mono text-sm">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
    );
}
