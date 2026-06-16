# 🍺 MARS Cervejaria — Sistema de Gestão

Projeto desenvolvido para a disciplina de **Programação Web**, convertendo o site HTML/CSS da MARS Cervejaria em uma aplicação React com sistema de login, CRUDs e relatório.

---

## 🚀 Como rodar o projeto

**Pré-requisitos:** Node.js instalado

```bash
# 1. Clone o repositório
git clone https://github.com/joaopedroolima/mars-cervejaria.git
cd mars-cervejaria

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: **http://localhost:5173**

> Se a porta 5173 estiver ocupada, o Vite usará a próxima disponível (ex: 5174).

---

## 🔐 Acesso ao sistema

| Campo  | Valor             |
|--------|-------------------|
| E-mail | `admin@mars.com`  |
| Senha  | `123456`          |

---

## 📋 Funcionalidades

### 🔐 Login
- Autenticação com e-mail e senha
- Validação de campos obrigatórios
- Sessão persistida via `localStorage` (continua logado ao recarregar)
- Logout funcional
- Proteção de rotas — sem login, redireciona para `/login`

### 🍺 CRUD — Cervejas
- Cadastro com nome, estilo, teor alcoólico e preço
- Listagem em cards com imagem da garrafa
- Edição e exclusão
- Dados salvos no `localStorage`

### 🏭 CRUD — Fornecedores
- Cadastro com nome, CNPJ e contato
- Listagem com componente reutilizável (`FornecedorCard`)
- Edição e exclusão

### 🧾 CRUD — Vendas
- Cadastro vinculado às cervejas cadastradas
- Cálculo automático do valor total (quantidade × preço)
- Listagem, edição e exclusão
- Dados salvos no `localStorage`

### 📊 Relatório com JOIN
- Cruzamento de Vendas × Cervejas simulando um JOIN (`map` + `find`)
- Ranking das cervejas mais vendidas
- Tabela detalhada com todas as vendas enriquecidas com dados da cerveja
- Totais: pedidos, unidades vendidas e receita geral

---

## 🗂️ Estrutura do projeto

```
src/
├── context/
│   └── AuthContext.jsx          # Login, logout e sessão
├── components/
│   ├── Header/                  # Navegação com logo MARS
│   ├── ProtectedRoute/          # Bloqueio de rotas sem login
│   ├── CervejaCard/             # Card reutilizável com imagem
│   ├── FornecedorCard/          # Card reutilizável de fornecedor
│   └── VendaCard/               # Card reutilizável de venda
└── pages/
    ├── Login/                   # Tela de login
    ├── Cervejas/                # CRUD 1
    ├── Fornecedores/            # CRUD 2
    ├── Vendas/                  # CRUD 3
    └── Relatorio/               # Relatório com JOIN
```

---

## 👥 Divisão de tarefas

### ✅ Integrante 1 — Login + Estrutura base `(CONCLUÍDO)`
- [x] Configurar o projeto React (Vite + React Router v6 + estrutura de pastas)
- [x] Tela de login com e-mail e senha
- [x] Validação de campos obrigatórios
- [x] Controle de sessão com `localStorage` (mantém logado ao recarregar)
- [x] Logout funcional
- [x] Proteção de rotas — sem login redireciona para `/login`

---

### ⏳ Integrante 2 — CRUD 1: Cervejas `(PENDENTE)`

> **Arquivo:** `src/pages/Cervejas/Cervejas.jsx` e `src/components/CervejaCard/CervejaCard.jsx`

- [ ] Cadastro de cerveja com validação (nome, estilo, teor alcoólico, preço)
- [ ] Listagem dinâmica usando `map()`
- [ ] Edição de cerveja existente
- [ ] Exclusão de cerveja

**Para começar:**
```bash
git checkout -b feat/cervejas
```

---

### ⏳ Integrante 3 — CRUD 2: Fornecedores `(PENDENTE)`

> **Arquivo:** `src/pages/Fornecedores/Fornecedores.jsx` e `src/components/FornecedorCard/FornecedorCard.jsx`

- [ ] Cadastro de fornecedor (nome, CNPJ, contato)
- [ ] Listagem usando componente reutilizável (`FornecedorCard`)
- [ ] Edição de fornecedor existente
- [ ] Exclusão de fornecedor

**Para começar:**
```bash
git checkout -b feat/fornecedores
```

---

### ⏳ Integrante 4 — CRUD 3: Vendas `(PENDENTE)`

> **Arquivo:** `src/pages/Vendas/Vendas.jsx` e `src/components/VendaCard/VendaCard.jsx`

- [ ] Cadastro de venda vinculada a uma cerveja (quantidade, data, valor)
- [ ] Usar `useState` para controle do estado
- [ ] Persistência dos dados com `localStorage`
- [ ] Edição e exclusão de venda

**Para começar:**
```bash
git checkout -b feat/vendas
```

---

### ⏳ Integrante 5 — Relatório com JOIN `(PENDENTE)`

> **Arquivo:** `src/pages/Relatorio/Relatorio.jsx`

- [ ] Tela de relatório cruzando Vendas + Cervejas
- [ ] JOIN simulado usando `map()` + `find()` / `filter()`
- [ ] Exibir quais cervejas mais vendidas e valor total por produto
- [ ] Exibição clara e organizada dos dados relacionados

**Para começar:**
```bash
git checkout -b feat/relatorio
```

---

### 📌 Como cada integrante entrega

```bash
# 1. Clone o projeto (se ainda não tiver)
git clone https://github.com/joaopedroolima/mars-cervejaria.git
cd mars-cervejaria
npm install

# 2. Crie sua branch (substitua pelo nome certo)
git checkout -b feat/cervejas

# 3. Faça suas alterações nos arquivos indicados acima

# 4. Suba quando terminar
git add .
git commit -m "feat: CRUD de cervejas completo"
git push origin feat/cervejas

# 5. Abra um Pull Request no GitHub: feat/sua-branch → main
```

---

## 🛠️ Tecnologias

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router v6](https://reactrouter.com/)
- Design baseado no site HTML/CSS original da MARS Cervejaria
