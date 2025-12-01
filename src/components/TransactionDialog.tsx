import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
      console.log("Categorias carregadas:", response.data);
      setCategories(response.data || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Erro ao carregar categorias",
        description: error?.response?.data?.message || "Verifique sua conexão",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor maior que zero",
        variant: "destructive",
      });
      return;
    }

    if (!formData.transaction_date) {
      toast({
        title: "Data inválida",
        description: "Por favor, selecione uma data",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const transactionData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description.trim() || null,
        category_id: formData.category_id || null,
        transaction_date: formData.transaction_date,
      };

      console.log("Enviando transação:", transactionData);

      if (transaction) {
        await api.put(`/transactions/${transaction.id}`, transactionData);
        toast({
          title: "Sucesso!",
          description: "Transação atualizada com sucesso",
        });
      } else {
        const response = await api.post("/transactions", transactionData);
        console.log("Resposta do servidor:", response.data);
        toast({
          title: "Sucesso!",
          description: "Transação criada com sucesso",
        });
      }

      onOpenChange(false);
      onSuccess();
      
    } catch (error: any) {
      console.error("Error saving transaction:", error);
      console.error("Error details:", error.response?.data);
      
      const errorMessage = error?.response?.data?.message 
        || error?.response?.data?.error
        || "Ocorreu um erro ao salvar a transação";
      
      toast({
        title: "Erro ao salvar transação",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para {transaction ? "editar" : "criar"} uma transação
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo *</Label>
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
            <Label htmlFor="amount">Valor *</Label>
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
              onValueChange={(value) => {
                console.log("Categoria selecionada:", value);
                setFormData({ ...formData, category_id: value });
              }}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {categories.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    Nenhuma categoria disponível
                  </div>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {categories.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {categories.length} categoria(s) disponível(is)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data *</Label>
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