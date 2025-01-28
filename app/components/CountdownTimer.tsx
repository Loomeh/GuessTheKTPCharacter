"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState<string>('--:--:--');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const tomorrow = new Date(now);

            // Set the next UTC midnight
            tomorrow.setUTCDate(now.getUTCDate() + 1);
            tomorrow.setUTCHours(0, 0, 0, 0); // Midnight in UTC

            const difference = tomorrow.getTime() - now.getTime();

            // Calculate hours, minutes, and seconds in UTC
            const hours = Math.floor(difference / (1000 * 60 * 60)).toString().padStart(2, '0');
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            const seconds = Math.floor((difference % (1000 * 60)) / 1000).toString().padStart(2, '0');

            return `${hours}:${minutes}:${seconds}`;
        };

        // Immediate initial calculation
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return <div className="text-xl font-extrabold text-gray-700 mt-2">{timeLeft}</div>;
}