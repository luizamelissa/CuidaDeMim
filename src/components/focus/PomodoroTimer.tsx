'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Coffee } from 'lucide-react';

export default function PomodoroTimer() {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [sessions, setSessions] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        // Timer finished
                        handleTimerComplete();
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, minutes, seconds]);

    const handleTimerComplete = () => {
        setIsActive(false);
        if (!isBreak) {
            setSessions(sessions + 1);
            setIsBreak(true);
            setMinutes(5);
            setSeconds(0);
        } else {
            setIsBreak(false);
            setMinutes(25);
            setSeconds(0);
        }
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setMinutes(25);
        setSeconds(0);
    };

    const progress = isBreak
        ? ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100
        : ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100;

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-border">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    {isBreak ? <Coffee className="w-5 h-5 text-orange-500" /> : <Timer className="w-5 h-5 text-primary" />}
                    {isBreak ? 'Pausa' : 'Foco'}
                </h3>
                <div className="text-sm text-muted-foreground">
                    {sessions} sessões completas
                </div>
            </div>

            <div className="relative mb-8">
                <svg className="w-full h-48" viewBox="0 0 200 200">
                    <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="#e5e5e5"
                        strokeWidth="8"
                    />
                    <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke={isBreak ? '#f97316' : '#2E8B57'}
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 90}`}
                        strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                        transform="rotate(-90 100 100)"
                        className="transition-all duration-1000"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-5xl font-bold">
                            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                            {isBreak ? 'Descanse um pouco' : 'Mantenha o foco!'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 justify-center">
                <button
                    onClick={toggleTimer}
                    className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${isActive
                            ? 'bg-muted text-foreground hover:bg-muted/80'
                            : isBreak
                                ? 'bg-orange-500 text-white hover:bg-orange-600'
                                : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                >
                    {isActive ? (
                        <>
                            <Pause className="w-5 h-5" />
                            Pausar
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5" />
                            Iniciar
                        </>
                    )}
                </button>
                <button
                    onClick={resetTimer}
                    className="px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-all"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
