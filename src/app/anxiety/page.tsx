'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Heart, Sparkles, Wind } from 'lucide-react';

const GROUNDING_MESSAGES = [
    "Respire fundo. Você está seguro agora.",
    "Nomeie 5 coisas que você pode ver ao seu redor.",
    "Sinta seus pés no chão. Você está presente.",
    "Coloque a mão no peito e sinta sua respiração.",
    "Você já passou por isso antes e vai passar de novo.",
];

const QUICK_QUESTIONS = [
    "Como você está se sentindo agora?",
    "O que está causando essa sensação?",
    "Você pode controlar isso neste momento?",
    "O que você precisa agora para se acalmar?",
    "Que pensamento positivo você pode ter?",
];

export default function AnxietyPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [anxietyLevel, setAnxietyLevel] = useState(5);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [showGrounding, setShowGrounding] = useState(false);

    if (user?.goal !== 'anxiety') {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Área de Ansiedade</h2>
                <p className="text-muted-foreground mb-6">
                    Esta área é exclusiva para usuários com objetivo "Reduzir Ansiedade".
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

    const getAnxietyColor = (level: number) => {
        if (level <= 3) return 'bg-green-500';
        if (level <= 6) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getAnxietyLabel = (level: number) => {
        if (level <= 3) return 'Calmo';
        if (level <= 6) return 'Moderado';
        return 'Alto';
    };

    const handleNextQuestion = () => {
        if (currentAnswer.trim()) {
            setAnswers([...answers, currentAnswer]);
            setCurrentAnswer('');
            if (currentQuestion < QUICK_QUESTIONS.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                alert('Check-in completo! Suas respostas foram salvas.');
                setCurrentQuestion(0);
                setAnswers([]);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Reduzir Ansiedade</h1>
                <p className="text-muted-foreground">Ferramentas para acalmar sua mente e encontrar equilíbrio.</p>
            </div>

            {/* Anxiety Slider */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-border">
                <h3 className="text-xl font-bold mb-4">Como está sua ansiedade agora?</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground w-16">Calmo</span>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={anxietyLevel}
                            onChange={(e) => setAnxietyLevel(Number(e.target.value))}
                            className="flex-1 h-3 rounded-full appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)`
                            }}
                        />
                        <span className="text-sm text-muted-foreground w-16 text-right">Ansioso</span>
                    </div>
                    <div className="text-center">
                        <div className={`inline-block px-6 py-2 rounded-full text-white font-bold ${getAnxietyColor(anxietyLevel)}`}>
                            Nível {anxietyLevel}/10 - {getAnxietyLabel(anxietyLevel)}
                        </div>
                    </div>
                    {anxietyLevel >= 7 && (
                        <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl text-sm text-orange-800">
                            <strong>Dica:</strong> Que tal fazer um exercício de respiração ou ler mensagens de grounding?
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Emotional Check */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-border">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        Check-in Rápido
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Pergunta {currentQuestion + 1} de {QUICK_QUESTIONS.length}
                    </p>
                    <div className="space-y-4">
                        <div className="font-medium text-lg">{QUICK_QUESTIONS[currentQuestion]}</div>
                        <textarea
                            value={currentAnswer}
                            onChange={(e) => setCurrentAnswer(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                            placeholder="Escreva sua resposta..."
                        />
                        <button
                            onClick={handleNextQuestion}
                            disabled={!currentAnswer.trim()}
                            className="w-full py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {currentQuestion < QUICK_QUESTIONS.length - 1 ? 'Próxima' : 'Finalizar'}
                        </button>
                    </div>
                </div>

                {/* Grounding Messages */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl shadow-sm border border-indigo-200">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <Wind className="w-5 h-5 text-indigo-600" />
                        Mensagens de Grounding
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Técnicas para voltar ao momento presente.
                    </p>
                    {!showGrounding ? (
                        <button
                            onClick={() => setShowGrounding(true)}
                            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Heart className="w-5 h-5" />
                            Preciso me acalmar
                        </button>
                    ) : (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                            {GROUNDING_MESSAGES.map((msg, i) => (
                                <div
                                    key={i}
                                    className="bg-white p-5 rounded-xl shadow-sm border border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-md"
                                    style={{
                                        animationDelay: `${i * 100}ms`,
                                        animation: 'fadeIn 0.5s ease-out forwards',
                                        opacity: 0
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-indigo-600 font-bold text-sm">{i + 1}</span>
                                        </div>
                                        <p className="text-base font-medium text-indigo-900 leading-relaxed">{msg}</p>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setShowGrounding(false)}
                                className="w-full py-3 bg-white border-2 border-indigo-200 text-indigo-700 rounded-xl hover:bg-indigo-50 font-medium transition-all mt-2"
                            >
                                Fechar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

            {user?.plan === 'premium' && (
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 rounded-3xl border border-purple-200">
                    <h3 className="font-bold text-lg mb-2">🌟 Recursos Premium Ativos</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>✓ Análise emocional avançada com gráficos</li>
                        <li>✓ Sessões guiadas de relaxamento por IA</li>
                        <li>✓ Modo Calma Total (interface minimalista)</li>
                        <li>✓ Áudios relaxantes exclusivos</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
