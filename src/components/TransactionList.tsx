import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Filter } from "lucide-react";
import { TransactionDialog } from "./TransactionDialog";
import { TransactionFilters } from "./TransactionFilters";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string | null;
  transaction_date: string;
  category_id: string | null;
  categories: {
    name: string;
    color: string;
    icon: string;
  } | null;
}

interface FilterState {
  type: string;
  categoryId: string;
  startDate: string;
  endDate: string;
}

interface TransactionListProps {
  onTransactionChange?: () => void;
}

export const TransactionList = ({ onTransactionChange }: TransactionListProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    categoryId: "all",
    startDate: "",
    endDate: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      // Construir query params para filtros
      const params: any = {};

      if (filters.type !== "all") {
        params.type = filters.type;
      }

      if (filters.categoryId !== "all") {
        params.category_id = filters.categoryId;
      }

      if (filters.startDate) {
        params.start_date = filters.startDate;
      }

      if (filters.endDate) {
        params.end_date = filters.endDate;
      }

      const response = await api.get("/transactions", { params });
      setTransactions(response.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Erro ao carregar transações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;

    try {
      await api.delete(`/transactions/${transactionToDelete}`);

      toast({
        title: "Transação excluída com sucesso",
      });
      fetchTransactions();
      onTransactionChange?.();
    } catch (error) {
      toast({
        title: "Erro ao excluir transação",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date + "T00:00:00").toLocaleDateString("pt-BR");
  };

  if (loading) {
    return <div className="text-center py-8">Carregando transações...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Transações</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <TransactionFilters filters={filters} setFilters={setFilters} />
        )}

        <div className="space-y-3 mt-4">
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma transação encontrada
            </p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {transaction.categories && (
                    <span className="text-2xl">{transaction.categories.icon}</span>
                  )}
                  <div>
                    <p className="font-medium">{transaction.description || "Sem descrição"}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatDate(transaction.transaction_date)}</span>
                      {transaction.categories && (
                        <>
                          <span>•</span>
                          <span style={{ color: transaction.categories.color }}>
                            {transaction.categories.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold text-lg ${
                      transaction.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingTransaction(transaction);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setTransactionToDelete(transaction.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTransaction(null);
        }}
        transaction={editingTransaction}
        onSuccess={() => {
          fetchTransactions();
          onTransactionChange?.();
          setDialogOpen(false);
          setEditingTransaction(null);
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};