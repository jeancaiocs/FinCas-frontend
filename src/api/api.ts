import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ========== FUNÇÕES DE TRANSAÇÃO ==========

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  user_id?: string;
}

// Buscar todas as transações
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get("/transactions");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    throw error;
  }
};

// Criar nova transação
export const createTransaction = async (
  transaction: Omit<Transaction, "id">
): Promise<Transaction> => {
  try {
    const response = await api.post("/transactions", transaction);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    throw error;
  }
};

// Atualizar transação
export const updateTransaction = async (
  id: string,
  transaction: Partial<Transaction>
): Promise<Transaction> => {
  try {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    throw error;
  }
};

// Deletar transação
export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    await api.delete(`/transactions/${id}`);
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    throw error;
  }
};

// Filtrar transações por período
export const getTransactionsByPeriod = async (
  startDate: string,
  endDate: string
): Promise<Transaction[]> => {
  try {
    const response = await api.get("/transactions", {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar transações por período:", error);
    throw error;
  }
};

// ========== FUNÇÕES DE AUTENTICAÇÃO ==========

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Login
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/login", credentials);
    const { token, user } = response.data;
    localStorage.setItem("auth_token", token);
    return { token, user };
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

// Registro
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/register", data);
    const { token, user } = response.data;
    localStorage.setItem("auth_token", token);
    return { token, user };
  } catch (error) {
    console.error("Erro ao registrar:", error);
    throw error;
  }
};

// Logout
export const logout = (): void => {
  localStorage.removeItem("auth_token");
  window.location.href = "/login";
};

// Buscar usuário atual
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};

// ========== FUNÇÕES DE CATEGORIAS (EXEMPLO) ==========

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    throw error;
  }
};