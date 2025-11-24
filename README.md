# 💰 Finance Control

Sistema completo de controle financeiro pessoal com dashboard interativo, gestão de transações e relatórios detalhados.


## 🚀 Sobre o Projeto

O **FinCas** é uma aplicação web moderna para gerenciamento financeiro pessoal. Permite aos usuários:

- 📊 Visualizar resumo financeiro em tempo real
- 💸 Registrar receitas e despesas
- 🏷️ Categorizar transações
- 📈 Acompanhar evolução do saldo
- 🔍 Filtrar transações por período, tipo e categoria
- 📱 Interface responsiva e intuitiva

## 🛠️ Tecnologias

### Backend
- **Java 17** - Linguagem de programação
- **Spring Boot 3.x** - Framework principal
- **Spring Security** - Autenticação e autorização
- **JWT (JSON Web Token)** - Tokens de autenticação
- **Spring Data JPA** - Persistência de dados
- **PostgreSQL** - Banco de dados relacional
- **Maven** - Gerenciamento de dependências

### Frontend
- **React 18** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **Shadcn/ui** - Componentes UI
- **Axios** - Cliente HTTP
- **React Router** - Navegação
- **Lucide React** - Ícones

## ✨ Funcionalidades

### Autenticação
- [x] Cadastro de usuários com senha criptografada (BCrypt)
- [x] Login com JWT
- [x] Proteção de rotas privadas
- [x] Logout com remoção de token

### Dashboard
- [x] Saldo atual
- [x] Total de receitas
- [x] Total de despesas
- [x] Taxa de economia
- [x] Despesas por categoria com gráficos

### Transações
- [x] Criar transações (receitas e despesas)
- [x] Editar transações existentes
- [x] Deletar transações
- [x] Listar todas as transações
- [x] Filtrar por tipo (receita/despesa)
- [x] Filtrar por categoria
- [x] Filtrar por período (data inicial e final)
- [x] Visualização detalhada com ícones e cores

### Categorias
- [x] Categorias pré-definidas
- [x] Ícones personalizados para cada categoria
- [x] Cores distintas para identificação visual

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Java 17+** - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.8+** - [Download](https://maven.apache.org/download.cgi)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/finance-control.git
cd finance-control
```

### 2. Configure o Banco de Dados

Crie um banco de dados PostgreSQL:

```sql
CREATE DATABASE financecontrol;
```

Execute o script SQL para criar as tabelas:

```sql
-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    color VARCHAR(20)
);

-- Criar tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    category_id BIGINT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Inserir categorias padrão
INSERT INTO categories (name, icon, color) VALUES
('Alimentação', '🍔', '#FF5733'),
('Transporte', '🚗', '#3498DB'),
('Moradia', '🏠', '#2ECC71'),
('Saúde', '💊', '#E74C3C'),
('Educação', '📚', '#9B59B6'),
('Lazer', '🎮', '#F39C12'),
('Salário', '💰', '#27AE60'),
('Freelance', '💻', '#16A085'),
('Investimentos', '📈', '#8E44AD'),
('Outros', '📌', '#95A5A6');
```

### 3. Configure o Backend

Edite o arquivo `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/financecontrol
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=sua_chave_secreta_super_segura_aqui_minimo_256_bits
jwt.expiration=604800000

# CORS
spring.web.cors.allowed-origins=http://localhost:5173
```

### 4. Instale as dependências do Backend

```bash
cd backend
mvn clean install
```

### 5. Instale as dependências do Frontend

```bash
cd ../frontend
npm install
```

## ⚙️ Configuração

### Backend - application.properties

| Propriedade | Descrição | Valor Padrão |
|------------|-----------|--------------|
| `spring.datasource.url` | URL do banco de dados | `jdbc:postgresql://localhost:5432/financecontrol` |
| `jwt.secret` | Chave secreta para JWT | (configure sua chave) |
| `jwt.expiration` | Tempo de expiração do token (ms) | `604800000` (7 dias) |

### Frontend - src/api/api.ts

```typescript
export const api = axios.create({
  baseURL: "http://localhost:8080", // URL do backend
  headers: {
    "Content-Type": "application/json",
  },
});
```

## 🚀 Executando o Projeto

### Backend

```bash
cd backend
mvn spring-boot:run
```

O servidor estará rodando em: `http://localhost:8080`

### Frontend

```bash
cd frontend
npm run dev
```

O aplicativo estará disponível em: `http://localhost:5173`

## 📁 Estrutura do Projeto

```
finance-control/
├── backend/
│   └── src/
│       └── main/
│           ├── java/com/jeancaio/financecontrol/
│           │   ├── config/
│           │   │   ├── CorsConfig.java
│           │   │   ├── SecurityConfig.java
│           │   │   ├── JwtUtil.java
│           │   │   └── JwtAuthenticationFilter.java
│           │   ├── controller/
│           │   │   ├── AuthController.java
│           │   │   ├── UserController.java
│           │   │   ├── TransactionController.java
│           │   │   └── CategoryController.java
│           │   ├── model/
│           │   │   ├── User.java
│           │   │   ├── Transaction.java
│           │   │   └── Category.java
│           │   ├── repository/
│           │   │   ├── UserRepository.java
│           │   │   ├── TransactionRepository.java
│           │   │   └── CategoryRepository.java
│           │   ├── service/
│           │   │   ├── UserService.java
│           │   │   └── TransactionService.java
│           │   └── FinanceControlApplication.java
│           └── resources/
│               └── application.properties
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── api.ts
    │   ├── components/
    │   │   ├── ui/
    │   │   ├── Dashboard.tsx
    │   │   ├── TransactionList.tsx
    │   │   ├── TransactionDialog.tsx
    │   │   ├── TransactionFilters.tsx
    │   │   └── ProtectedRoute.tsx
    │   ├── pages/
    │   │   ├── Login.tsx
    │   │   └── Index.tsx
    │   ├── lib/
    │   │   └── utils.ts
    │   ├── hooks/
    │   │   └── use-toast.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    └── tailwind.config.ts
```

## 🔌 API Endpoints

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/auth/register` | Cadastrar novo usuário | ❌ |
| POST | `/auth/login` | Fazer login | ❌ |
| GET | `/auth/me` | Buscar usuário atual | ✅ |

### Transações

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/transactions` | Listar transações | ✅ |
| POST | `/transactions` | Criar transação | ✅ |
| PUT | `/transactions/:id` | Atualizar transação | ✅ |
| DELETE | `/transactions/:id` | Deletar transação | ✅ |

**Query Params para filtros:**
- `type`: `income` ou `expense`
- `category_id`: ID da categoria
- `start_date`: Data inicial (YYYY-MM-DD)
- `end_date`: Data final (YYYY-MM-DD)

### Categorias

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/categories` | Listar categorias | ✅ |

### Exemplos de Requisições

#### Cadastro
```bash
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### Criar Transação
```bash
POST /transactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "expense",
  "amount": 150.50,
  "description": "Compra no mercado",
  "category_id": 1,
  "transaction_date": "2025-11-22"
}
```

## 🔐 Segurança

- ✅ Senhas criptografadas com BCrypt
- ✅ Autenticação JWT com expiração
- ✅ CORS configurado
- ✅ Proteção contra SQL Injection (JPA)
- ✅ Validação de dados no backend
- ✅ Rotas protegidas por autenticação

## 🐛 Solução de Problemas

### CORS Error
Se você receber erro de CORS, verifique se:
- O backend está rodando na porta 8080
- O frontend está configurado para `http://localhost:5173`
- O `CorsConfig.java` está configurado corretamente

### Erro de Conexão com Banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `application.properties`
- Certifique-se que o banco `financecontrol` foi criado

### Token Inválido
- Verifique se o `jwt.secret` está configurado
- Confirme que o token está sendo enviado no header: `Authorization: Bearer {token}`
- Token expira em 7 dias por padrão

## 📝 TODO

- [ ] Adicionar gráficos interativos
- [ ] Exportar relatórios em PDF
- [ ] Notificações de gastos
- [ ] Metas financeiras
- [ ] Modo escuro
- [ ] App mobile (React Native)

## 👨‍💻 Autor

**Jean Caio**

- GitHub: [@jeancaio](https://github.com/jeancaio)
- LinkedIn: [Jean Caio](https://linkedin.com/in/jeancaio)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

⭐ Se este projeto te ajudou, não esqueça de dar uma estrela!

**Desenvolvido com ❤️ e ☕**