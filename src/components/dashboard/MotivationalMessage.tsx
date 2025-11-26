'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Quote } from 'lucide-react';

const ANXIETY_MESSAGES = [
    "Respire. Você não precisa resolver tudo agora.",
    "Um passo de cada vez já é progresso.",
    "Sua paz é mais importante que sua produtividade."
];

const FOCUS_MESSAGES = [
    "O segredo é começar. O resto flui.",
    "Faça uma coisa de cada vez, e faça bem feito.",
    "Elimine o ruído, foque no sinal."
];

const PRODUCTIVITY_MESSAGES = [
    "Pequenas vitórias constroem grandes resultados.",
    "Organização é liberdade.",
    "Seu futuro é criado pelo que você faz hoje."
];

const GENERAL_MESSAGES = [
    "Você é capaz de coisas incríveis.",
    "Hoje é um ótimo dia para começar.",
    "Acredite no seu potencial."
];

export default function MotivationalMessage() {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Select message based on user goal
        let messages = GENERAL_MESSAGES;
        if (user?.goal === 'anxiety') messages = ANXIETY_MESSAGES;
        else if (user?.goal === 'focus') messages = FOCUS_MESSAGES;
        else if (user?.goal === 'productivity') messages = PRODUCTIVITY_MESSAGES;

        // Use day of year for consistency (same message per day)
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        const selectedMessage = messages[dayOfYear % messages.length];

        setMessage(selectedMessage);
        setIsLoading(false);
    }, [user?.goal]);

    if (isLoading) {
        return (
            <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-6 rounded-3xl border border-primary/20 animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4"></div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-6 rounded-3xl border border-primary/20 flex gap-4 items-start">
            <div className="bg-white p-3 rounded-xl shadow-sm text-primary">
                <Quote className="w-6 h-6" />
            </div>
            <div>
                <p className="text-foreground font-medium text-lg italic leading-relaxed">
                    "{message}"
                </p>
                <p className="text-muted-foreground text-sm mt-2 font-medium">
                    — Dica do dia para {user?.displayName?.split(' ')[0] || 'você'}
                </p>
            </div>
        </div>
    );
}
