# CREAVO — Plataforma de Criação de Criativos UGC

> De uma imagem a um criativo que converte — em 30 segundos.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)
![Supabase](https://img.shields.io/badge/Supabase-3-green)

## 🚀 Quick Start

### 1. Clone o repositório

```bash
git clone https://github.com/gustavopelicioniii-rgb/creavo.git
cd creavo
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# fal.ai (para geração de vídeo)
FAL_AI_API_KEY=your-fal-api-key

# Google AI (Gemini)
GOOGLE_AI_API_KEY=your-google-ai-key
```

### 4. Configure o banco de dados

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute as migrations em `supabase/migrations/001_initial_schema.sql`
3. Configure RLS (Row Level Security) conforme indicado

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
creavo/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/              # Páginas autenticadas
│   │   │   ├── dashboard/       # Dashboard principal
│   │   │   ├── projects/        # Gerenciamento de projetos
│   │   │   ├── templates/      # Biblioteca de templates
│   │   │   └── pricing/        # Planos e créditos
│   │   ├── (auth)/             # Páginas de autenticação
│   │   │   ├── login/          # Login
│   │   │   └── register/       # Cadastro
│   │   └── api/                # API Routes
│   ├── components/            # Componentes React
│   │   ├── ui/                # shadcn/ui components
│   │   └── canvas/            # Canvas editor
│   ├── hooks/                 # Custom hooks
│   └── lib/                   # Bibliotecas e utilitários
│       ├── supabase/          # Cliente Supabase
│       └── db/                # Schema e tipos
├── supabase/
│   └── migrations/            # Migrations do banco
└── public/                    # Arquivos estáticos
```

## 🎯 Funcionalidades

### Canvas Editor
- Interface drag & drop para criar criativos
- Suporte a textos, imagens e shapes
- Timeline para vídeos
- Preview em tempo real

### Geração de Vídeo UGC
- Conversão de imagem para vídeo via IA
- Múltiplos estilos (talking head, product showcase, etc)
- Processamento assíncrono com workers

### Geração de Imagens
- Text-to-image com DALL-E e Flux
- Image-to-image para variações
- Upscaling de resolução

### Sistema de Créditos
- Pack de créditos flexíveis
- Histórico de uso
- Alertas de crédito baixo

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 15 + React 19 |
| Estilização | Tailwind CSS 4 + shadcn/ui |
| Canvas | Konva.js + react-konva |
| Backend | API Routes (Next.js) |
| Banco de Dados | PostgreSQL (Supabase) |
| Autenticação | Supabase Auth |
| Armazenamento | Supabase Storage |
| Filas | BullMQ + Redis (futuro) |

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia em produção

# Linting
npm run lint         # Verifica erros de lint

# TypeScript
npm run typecheck    # Verifica tipos
```

## 🔐 Segurança

- Row Level Security (RLS) em todas as tabelas
- Autenticação via Supabase
- Validação de inputs com Zod
- Rate limiting em APIs

## 📄 Licença

MIT © CREAVO

---

Desenvolvido com 💜 para criar criativos que convertem.
