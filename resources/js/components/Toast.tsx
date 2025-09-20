import { useEffect } from 'react';

type ToastProps = {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number; // milliseconds
    onClose: () => void;
};

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const colorMap: Record<typeof type, string> = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
    };

    return (
        <div
            className={`fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-md ${colorMap[type]} animate-fade-in`}
        >
            {message}
        </div>
    );
}