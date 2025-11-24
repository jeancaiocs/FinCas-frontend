import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, DollarSign, TrendingUp } from "lucide-react";

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryExpenses: Array<{ name: string; total: number; color: string; icon: string }>;
}

export const Dashboard = () => {
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    categoryExpenses: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialSummary();
  }, []);

  const fetchFinancialSummary = async () => {
    try {
      const response = await api.get("/transactions");
      const transactions = response.data || [];

      const income = transactions
        .filter((t: any) => t.type === "income")
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

      const expenses = transactions
        .filter((t: any) => t.type === "expense")
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

      // Calculate expenses by category
      const categoryMap = new Map<string, { total: number; color: string; icon: string }>();
      
      transactions
        .filter((t: any) => t.type === "expense" && t.categories)
        .forEach((t: any) => {
          const category = t.categories;
          const current = categoryMap.get(category.name) || { total: 0, color: category.color, icon: category.icon };
          categoryMap.set(category.name, {
            total: current.total + Number(t.amount),
            color: category.color,
            icon: category.icon,
          });
        });

      const categoryExpenses = Array.from(categoryMap.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.total - a.total);

      setSummary({
        totalIncome: income,
        totalExpenses: expenses,
        balance: income - expenses,
        categoryExpenses,
      });
    } catch (error) {
      console.error("Error fetching financial summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {formatCurrency(summary.balance)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.totalExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Economia</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalIncome > 0
                ? `${((summary.balance / summary.totalIncome) * 100).toFixed(1)}%`
                : "0%"}
            </div>
          </CardContent>
        </Card>
      </div>

      {summary.categoryExpenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.categoryExpenses.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {((category.total / summary.totalExpenses) * 100).toFixed(1)}% do total
                      </p>
                    </div>
                  </div>
                  <span className="font-bold" style={{ color: category.color }}>
                    {formatCurrency(category.total)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};