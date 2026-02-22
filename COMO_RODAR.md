# Growtwitter — Como rodar o projeto

## Pré-requisitos

- Node.js instalado (versão 18 ou superior)
- npm ou pnpm instalado

---

## Instalação e execução

```bash
# 1. Entrar na pasta do projeto
cd frontend_growtwitter

# 2. Instalar as dependências
npm install

# 3. Rodar em modo desenvolvimento
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

---

## Estrutura das páginas

| Rota | Página | Acesso |
|------|--------|--------|
| `/login` | Tela de login | Público |
| `/cadastro` | Tela de cadastro | Público |
| `/feed` | Feed principal com tweets | Requer login |
| `/explorar` | Lista de usuários com busca | Requer login |
| `/perfil/:id` | Perfil de um usuário | Requer login |

---

## Funcionalidades implementadas

- **Login** com e-mail ou username
- **Cadastro** de novo usuário
- **Proteção de rotas** — usuário não logado é redirecionado para o login
- **Feed** com listagem de todos os tweets em tempo real
- **Criar tweet** via modal (botão "Tweetar")
- **Responder tweet** clicando no ícone de comentário
- **Visualizar replies** diretamente no feed
- **Página Explorar** com lista de usuários e busca por nome/username
- **Página Perfil** com foto, data de cadastro e tweets do usuário
- **Navegação** completa entre todas as páginas pelo menu lateral
- **Logout** com limpeza do token

---

## API utilizada

A aplicação consome a API pública da Growdev:

- **Base URL:** `https://backend-growtwitter.onrender.com`
- **Documentação:** `https://backend-growtwitter.onrender.com/api-docs`

### Endpoints principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/sign-up` | Cadastro de usuário |
| POST | `/login` | Login (retorna token JWT) |
| GET | `/tweets` | Listar todos os tweets |
| POST | `/tweets` | Criar novo tweet |
| POST | `/tweets/:id/reply` | Responder um tweet |
| GET | `/user` | Listar todos os usuários |
| GET | `/user/:id` | Buscar usuário por ID |

---

## Arquivos modificados/criados

- `src/pages/feed.tsx` — Feed com reply, navegação e atualização automática
- `src/pages/login.tsx` — Login com link para cadastro
- `src/pages/sign-up.tsx` — Cadastro com link para login
- `src/pages/profile.tsx` — **NOVO** — Página de perfil do usuário
- `src/pages/profile.css` — **NOVO** — Estilos do perfil
- `src/pages/explorar.tsx` — **NOVO** — Página de explorar usuários
- `src/pages/explorar.css` — **NOVO** — Estilos do explorar
- `src/routes/index.tsx` — Rotas atualizadas com proteção e novas páginas
- `src/components/PrivateRoute.tsx` — **NOVO** — Componente de proteção de rotas
