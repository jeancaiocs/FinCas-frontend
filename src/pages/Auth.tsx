import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { api } from "@/api/api"; 

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // (Opcional) se quiser manter validação de login já existente
  useEffect(() => {
    const session = localStorage.getItem("user");
    if (session) navigate("/");
  }, [navigate]);

  // 🚀 CADASTRO
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/users", {
        name: fullName,
        email,
        password,
      });

      toast.toast({
        title: "Cadastro realizado!",
        description: "Agora faça login para continuar.",
      });

    } catch (err) {
      toast.toast({
        title: "Erro ao cadastrar",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  // 🚀 LOGIN
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data));

      toast.toast({
        title: "Login realizado!",
      });

      navigate("/");

    } catch (err) {
      toast.toast({
        title: "Erro ao fazer login",
        description: "Email ou senha inválidos.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
      <Card className="w-[380px] shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            FinCas
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <form className="space-y-4 mt-4" onSubmit={handleSignIn}>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Senha</Label>
                  <Input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button className="w-full mt-4" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            {/* CADASTRO */}
            <TabsContent value="register">
              <form className="space-y-4 mt-4" onSubmit={handleSignUp}>
                <div>
                  <Label>Nome Completo</Label>
                  <Input
                    placeholder="Seu nome"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Senha</Label>
                  <Input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button className="w-full mt-4" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : "Cadastrar"}
                </Button>
              </form>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
