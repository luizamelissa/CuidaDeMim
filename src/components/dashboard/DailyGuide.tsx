'use client';

import { useState } from 'react';
import { Play, X, CheckCircle2, Circle, Wind } from 'lucide-react';

export default function DailyGuide() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'checklist' | 'breathing'>('checklist');

    // Self Care Checklist State
    const [checklist, setChecklist] = useState([
        { id: 1, text: 'Beber 1 copo de água', done: false },
        { id: 2, text: 'Alongar por 2 min', done: false },
        { id: 3, text: 'Pausa para respirar', done: false },
        { id: 4, text: 'Elogiar a si mesmo', done: false },
    ]);

    // Breathing State
    const [isBreathing, setIsBreathing] = useState(false);
    const [breathPhase, setBreathPhase] = useState<'Inspirar' | 'Segurar' | 'Expirar'>('Inspirar');
    const [timer, setTimer] = useState(0);

    const toggleCheck = (id: number) => {
        setChecklist(prev => prev.map(item =>
            item.id === id ? { ...item, done: !item.done } : item
        ));
    };

    const startBreathing = () => {
        setIsBreathing(true);
        // Simple mock animation logic would go here
        // For now just a visual toggle
    };

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl shadow-sm text-white cursor-pointer hover:shadow-md transition-all relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Wind className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Play className="w-5 h-5 fill-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Assistente de Autocuidado</h3>
                    <p className="text-blue-100 text-sm">Checklist & Respiração</p>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('checklist')}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'checklist' ? 'bg-white shadow text-primary' : 'text-muted-foreground hover:bg-white/50'}`}
                                >
                                    Checklist
                                </button>
                                <button
                                    onClick={() => setActiveTab('breathing')}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'breathing' ? 'bg-white shadow text-blue-600' : 'text-muted-foreground hover:bg-white/50'}`}
                                >
                                    Respiração
                                </button>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 min-h-[300px]">
                            {activeTab === 'checklist' ? (
                                <div className="space-y-4">
                                    <h3 className="font-bold text-xl text-center mb-6">Autocuidado Rápido</h3>
                                    <div className="space-y-3">
                                        {checklist.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => toggleCheck(item.id)}
                                                className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${item.done
                                                        ? 'bg-green-50 border-green-200 text-green-800'
                                                        : 'bg-white border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                {item.done ? (
                                                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                                                ) : (
                                                    <Circle className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                                                )}
                                                <span className={`font-medium ${item.done ? 'line-through opacity-70' : ''}`}>
                                                    {item.text}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-center text-xs text-muted-foreground mt-4">
                                        Complete para ganhar pontos de autocuidado!
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full space-y-8 py-8">
                                    <div className="relative">
                                        <div className={`w-48 h-48 rounded-full bg-blue-50 flex items-center justify-center transition-all duration-[4000ms] ${isBreathing ? 'scale-110 bg-blue-100' : 'scale-100'}`}>
                                            <div className={`w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center transition-all duration-[4000ms] ${isBreathing ? 'scale-110 bg-blue-200' : 'scale-100'}`}>
                                                <Wind className={`w-12 h-12 text-blue-500 transition-all duration-[4000ms] ${isBreathing ? 'scale-125' : 'scale-100'}`} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center space-y-2">
                                        <h3 className="text-2xl font-bold text-blue-600">
                                            {isBreathing ? 'Respire fundo...' : 'Pronto para relaxar?'}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Técnica 4-7-8 para acalmar a ansiedade.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setIsBreathing(!isBreathing)}
                                        className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg ${isBreathing
                                                ? 'bg-muted text-foreground hover:bg-muted/80'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {isBreathing ? 'Parar' : 'Começar'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
