import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string | null;
  transaction_date: string;
  category_id: string | null;
}

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  onSuccess: () => void;
}

export const TransactionDialog = ({
  open,
  onOpenChange,
  transaction,
  onSuccess,
}: TransactionDialogProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    description: "",
    category_id: "",
    transaction_date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (transaction) {
        setFormData({
          type: transaction.type,
          amount: transaction.amount.toString(),
          description: transaction.description || "",
          category_id: transaction.category_id || "",
          transaction_date: transaction.transaction_date,
        });
      } else {
        setFormData({
          type: "expense",
          amount: "",
          description: "",
          category_id: "",
          transaction_date: new Date().toISOString().split("T")[0],
        });
      }
    }
  }, [open, transaction]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Erro ao carregar categorias",
        description: "Não foi possível carregar as categorias disponíveis",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor maior que zero",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const transactionData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description || null,
        category_id: formData.category_id || null,
        transaction_date: formData.transaction_date,
      };

      if (transaction) {
        await api.put(`/transactions/${transaction.id}`, transactionData);
        toast({
          title: "Sucesso!",
          description: "Transação atualizada com sucesso",
        });
      } else {
        await api.post("/transactions", transactionData);
        toast({
          title: "Sucesso!",
          description: "Transação criada com sucesso",
        });
      }

      onOpenChange(false); // Fecha o dialog
      onSuccess(); // Atualiza a lista
      
    } catch (error: any) {
      console.error("Error saving transaction:", error);
      toast({
        title: "Erro ao salvar transação",
        description: error?.response?.data?.message || "Ocorreu um erro ao salvar a transação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "income" | "expense") =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) =>
                setFormData({ ...formData, category_id: value })
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5}>
                {categories.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Nenhuma categoria disponível
                  </SelectItem>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.transaction_date}
              onChange={(e) =>
                setFormData({ ...formData, transaction_date: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição da transação (opcional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};