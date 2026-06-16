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

| Integrante | Responsabilidade |
|------------|-----------------|
| Integrante 1 | Login + Estrutura base (rotas, pastas, proteção) |
| Integrante 2 | CRUD de Cervejas |
| Integrante 3 | CRUD de Fornecedores |
| Integrante 4 | CRUD de Vendas |
| Integrante 5 | Relatório com JOIN |

---

## 🛠️ Tecnologias

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router v6](https://reactrouter.com/)
- Design baseado no site HTML/CSS original da MARS Cervejaria
