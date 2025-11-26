# Cuida de Mim - Assistente Emocional e de Produtividade

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

O **Cuida de Mim** é um **Assistente Pessoal** focado em promover o **equilíbrio emocional** e a **produtividade** através de ferramentas digitais. Desenvolvido como um **MVP (Produto Mínimo Viável)**, ele oferece uma experiência de usuário intuitiva e responsiva, pronta para ser instalada como um PWA (Progressive Web App) em dispositivos móveis.

## 🌟 Funcionalidades Principais

O projeto foi estruturado para ser um hub de autocuidado e foco, com as seguintes ferramentas:

| Categoria | Funcionalidade | Descrição |
| :--- | :--- | :--- |
| **Bem-Estar** | **Check-in Emocional** | Registro diário do humor com emojis e notas para acompanhamento. |
| **Produtividade** | **Prioridades do Dia** | Definição de até 3 tarefas principais para manter o foco e a clareza. |
| **Foco** | **Guia de 2 Minutos** | Exercício rápido de respiração e foco para momentos de ansiedade. |
| **Motivação** | **Mensagens Motivacionais** | Frases personalizadas exibidas no Dashboard, baseadas no objetivo do usuário. |
| **Acompanhamento** | **Dashboard Semanal** | Visualização do histórico de humor e progresso em um gráfico interativo. |
| **PWA** | **Instalação Móvel** | Pronto para ser instalado em smartphones via navegador. |

## 🛠️ Stack Tecnológico

O projeto utiliza tecnologias modernas e robustas para garantir performance e escalabilidade:

*   **Frontend Framework**: **Next.js 14** (App Router)
*   **Linguagem**: **TypeScript**
*   **Estilização**: **Tailwind CSS**
*   **Componentes**: **React 19**
*   **Gráficos**: **Recharts**
*   **Ícones**: **Lucide React**
*   **Gerenciamento de Dados**: Arquitetura de serviços flexível, com suporte a **Mock Services** (LocalStorage) e pronto para integração com **Firebase**.

## ⚙️ Estrutura do Projeto

A arquitetura segue as convenções do Next.js App Router, facilitando a manutenção e o desenvolvimento de novas funcionalidades:

```
CuidaDeMim/
├── src/
│   ├── app/             # Rotas e páginas (login, dashboard, diary, focus, etc.)
│   ├── components/      # Componentes reutilizáveis (DailyGuide, PomodoroTimer, HabitTracker)
│   ├── context/         # Contextos globais (AuthContext, ThemeContext)
│   ├── services/        # Lógica de acesso a dados (mock.ts, index.ts)
│   └── types/           # Definições de tipos TypeScript
├── public/              # Assets estáticos e arquivos PWA (manifest.json)
├── package.json         # Dependências e scripts
└── next.config.ts       # Configuração do Next.js
```

## 🚀 Como Rodar Localmente

Siga os passos abaixo para configurar e executar o projeto em sua máquina:

### Pré-requisitos

*   Node.js (versão 18+)
*   npm ou yarn

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/luizamelissa/CuidaDeMim.git
    cd CuidaDeMim
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou yarn install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou yarn dev
    ```

4.  **Acesse o projeto:**
    Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Configuração de Dados (Opcional)

Por padrão, o projeto utiliza **Mock Services** (dados salvos no `localStorage` do navegador), o que permite testar todas as funcionalidades sem a necessidade de configurar chaves de API.

Para alternar para o **Firebase** (se a integração estiver completa):

1.  Crie um arquivo `.env.local` na raiz do projeto.
2.  Adicione suas chaves de configuração do Firebase:

    ```env
    NEXT_PUBLIC_USE_MOCK=false
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    # ... outras chaves do Firebase
    ```

## 📝 Licença

Este projeto está sob a licença [MIT](https://opensource.org/licenses/MIT).

## Para acessar o site clique no lingue a seguir: https://cuida-de-mim-gamma.vercel.app/
