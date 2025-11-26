'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Calendar, CheckCircle2, Circle, Sun, Moon, TrendingUp } from 'lucide-react';

interface Task {
    id: string;
    text: string;
    time?: string;
    completed: boolean;
}

const MORNING_CHECKLIST = [
    'Tomar café da manhã',
    'Revisar agenda do dia',
    'Definir 3 prioridades',
    'Alongar ou exercitar',
];

const NIGHT_CHECKLIST = [
    'Revisar o que foi feito',
    'Preparar roupa do dia seguinte',
    'Definir horário de dormir',
    'Gratidão: 3 coisas boas do dia',
];

export default function OrganizationPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');
    const [newTaskTime, setNewTaskTime] = useState('');
    const [morningChecks, setMorningChecks] = useState<boolean[]>(new Array(MORNING_CHECKLIST.length).fill(false));
    const [nightChecks, setNightChecks] = useState<boolean[]>(new Array(NIGHT_CHECKLIST.length).fill(false));
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }));
    }, []);

    if (user?.goal !== 'productivity') {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Área de Organização</h2>
                <p className="text-muted-foreground mb-6">
                    Esta área é exclusiva para usuários com objetivo "Organizar o Dia".
                </p>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90"
                >
                    Voltar ao Dashboard
                </button>
            </div>
        );
    }

    const addTask = () => {
        if (newTask.trim()) {
            setTasks([...tasks, {
                id: Date.now().toString(),
                text: newTask,
                time: newTaskTime,
                completed: false
            }]);
            setNewTask('');
            setNewTaskTime('');
        }
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Organizar o Dia</h1>
                <p className="text-muted-foreground">Ferramentas para planejar e estruturar sua rotina.</p>
            </div>

            {/* Daily Summary */}
            <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-6 rounded-3xl border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Resumo do Dia
                    </h3>
                    <div className="text-sm text-muted-foreground">
                        {currentDate}
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl text-center">
                        <div className="text-3xl font-bold text-primary">{completedTasks}</div>
                        <div className="text-sm text-muted-foreground">Tarefas Concluídas</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl text-center">
                        <div className="text-3xl font-bold text-blue-500">{totalTasks}</div>
                        <div className="text-sm text-muted-foreground">Total de Tarefas</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl text-center">
                        <div className="text-3xl font-bold text-green-500">{Math.round(progress)}%</div>
                        <div className="text-sm text-muted-foreground">Progresso</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Planner */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-border">
                    <h3 className="text-xl font-bold mb-4">Planner Diário</h3>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="time"
                                value={newTaskTime}
                                onChange={(e) => setNewTaskTime(e.target.value)}
                                className="px-3 py-2 rounded-xl border border-border text-sm"
                            />
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                                placeholder="Nova tarefa..."
                                className="flex-1 px-4 py-2 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                            <button
                                onClick={addTask}
                                className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 font-semibold"
                            >
                                Adicionar
                            </button>
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {tasks.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    Nenhuma tarefa ainda. Adicione sua primeira!
                                </p>
                            ) : (
                                tasks.map(task => (
                                    <div
                                        key={task.id}
                                        onClick={() => toggleTask(task.id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${task.completed
                                                ? 'bg-green-50 border-green-200'
                                                : 'bg-white border-border hover:border-primary/50'
                                            }`}
                                    >
                                        {task.completed ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                        )}
                                        {task.time && (
                                            <span className="text-xs font-mono text-muted-foreground">{task.time}</span>
                                        )}
                                        <span className={`flex-1 ${task.completed ? 'line-through opacity-60' : ''}`}>
                                            {task.text}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Checklists */}
                <div className="space-y-4">
                    {/* Morning Checklist */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-3xl border border-yellow-200">
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                            <Sun className="w-5 h-5 text-orange-500" />
                            Checklist Matinal
                        </h4>
                        <div className="space-y-2">
                            {MORNING_CHECKLIST.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        const newChecks = [...morningChecks];
                                        newChecks[i] = !newChecks[i];
                                        setMorningChecks(newChecks);
                                    }}
                                    className={`w-full text-left p-2 rounded-lg flex items-center gap-2 text-sm transition-all ${morningChecks[i]
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-white hover:bg-orange-50'
                                        }`}
                                >
                                    {morningChecks[i] ? (
                                        <CheckCircle2 className="w-4 h-4 text-orange-600" />
                                    ) : (
                                        <Circle className="w-4 h-4 text-muted-foreground" />
                                    )}
                                    <span className={morningChecks[i] ? 'line-through' : ''}>{item}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Night Checklist */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-3xl border border-indigo-200">
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                            <Moon className="w-5 h-5 text-indigo-500" />
                            Checklist Noturno
                        </h4>
                        <div className="space-y-2">
                            {NIGHT_CHECKLIST.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        const newChecks = [...nightChecks];
                                        newChecks[i] = !newChecks[i];
                                        setNightChecks(newChecks);
                                    }}
                                    className={`w-full text-left p-2 rounded-lg flex items-center gap-2 text-sm transition-all ${nightChecks[i]
                                            ? 'bg-indigo-100 text-indigo-800'
                                            : 'bg-white hover:bg-indigo-50'
                                        }`}
                                >
                                    {nightChecks[i] ? (
                                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                                    ) : (
                                        <Circle className="w-4 h-4 text-muted-foreground" />
                                    )}
                                    <span className={nightChecks[i] ? 'line-through' : ''}>{item}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {user?.plan === 'premium' && (
                <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-6 rounded-3xl border border-primary/20">
                    <h3 className="font-bold text-lg mb-2">🌟 Recursos Premium Ativos</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>✓ Planner inteligente com IA (organiza automaticamente)</li>
                        <li>✓ Reorganização automática de tarefas atrasadas</li>
                        <li>✓ Calendário avançado com metas semanais</li>
                        <li>✓ Modo Semana Perfeita</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
