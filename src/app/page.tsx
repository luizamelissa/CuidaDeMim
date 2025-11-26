'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Heart, Brain, Zap, Shield, Sun, Moon } from 'lucide-react';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme
    const savedTheme = localStorage.getItem('cdm_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('cdm_theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            <span className="font-bold text-xl tracking-tight">Cuida de Mim</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Funcionalidades</Link>
            <Link href="#plans" className="hover:text-primary transition-colors">Planos</Link>
          </nav>
          <div className="flex gap-4 items-center">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
            )}
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          <div className="container mx-auto max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Seu assistente emocional 24/7
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
              Equilíbrio emocional e foco para o seu dia a dia.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Monitore seu humor, defina prioridades claras e receba motivação personalizada.
              Tudo em menos de 2 minutos por dia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 text-lg font-semibold bg-primary text-white rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/25 flex items-center justify-center gap-2"
              >
                Experimentar Grátis <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 text-lg font-semibold bg-muted text-foreground rounded-full hover:bg-muted/80 transition-all"
              >
                Saiba mais
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Como funciona</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Heart className="w-8 h-8 text-primary" />,
                  title: "Check-in Emocional",
                  desc: "Registre como você se sente em segundos. Acompanhe sua evolução semanal com gráficos simples."
                },
                {
                  icon: <Zap className="w-8 h-8 text-secondary" />,
                  title: "Foco no Essencial",
                  desc: "Defina apenas 3 prioridades por dia. Menos ansiedade, mais realização."
                },
                {
                  icon: <Brain className="w-8 h-8 text-purple-500" />,
                  title: "Motivação Inteligente",
                  desc: "Receba mensagens e guias rápidos personalizados para o seu momento atual."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-background p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow">
                  <div className="mb-4 bg-muted w-16 h-16 rounded-xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans */}
        <section id="plans" className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-4">Escolha seu plano</h2>
            <p className="text-center text-muted-foreground mb-16">Comece grátis, cancele quando quiser.</p>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Basic Plan */}
              <div className="p-8 rounded-3xl border border-border bg-background relative">
                <h3 className="text-2xl font-bold mb-2">Básico</h3>
                <div className="text-4xl font-bold mb-6">R$ 9,90<span className="text-lg font-normal text-muted-foreground">/mês</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Check-in diário de humor</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> 3 Prioridades do dia</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Histórico de 7 dias</li>
                </ul>
                <Link href="/register?plan=basic" className="block w-full py-3 text-center font-semibold border border-primary text-primary rounded-xl hover:bg-primary/5 transition-colors">
                  Começar Básico
                </Link>
              </div>

              {/* Premium Plan */}
              <div className="p-8 rounded-3xl border-2 border-primary bg-primary/5 relative shadow-xl">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Mais Popular
                </div>
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="text-4xl font-bold mb-6">R$ 19,90<span className="text-lg font-normal text-muted-foreground">/mês</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> <b>Tudo do Básico</b></li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Mensagens personalizadas (IA)</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Guia de áudio diário</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Dashboard completo</li>
                </ul>
                <Link href="/register?plan=premium" className="block w-full py-3 text-center font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                  Começar Premium
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-primary" fill="currentColor" />
            <span className="font-bold text-foreground">Cuida de Mim</span>
          </div>
          <p>© 2024 Cuida de Mim. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
