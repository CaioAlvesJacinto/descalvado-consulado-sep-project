import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Alert, AlertDescription,
} from "@/components/ui/alert";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/Layout";
import { AlertCircle } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(1, { message: "Senha é obrigatória" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Caminho anterior de onde o usuário veio
  const from = (location.state as any)?.from;
  const fromPath = typeof from === "string" ? from : from?.pathname;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

    const onSubmit = async (data: LoginFormValues) => {
      setError(null);
      setIsSubmitting(true);

      try {
        await login(data.email, data.password);
      } catch (err: any) {
        const errorMessage = (() => {
          switch (err?.message) {
            case "Invalid login credentials":
              return "E-mail ou senha incorretos";
            case "Email not confirmed":
              return "E-mail ainda não confirmado";
            default:
              return err?.message || "Erro ao fazer login";
          }
        })();

        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    };



  useEffect(() => {
    if (!isAuthenticated || !user) return;

    if (user.role === "gerente") {
      navigate("/admin", { replace: true });
    } else if (user.role === "colaborador") {
      navigate("/colaborador", { replace: true });
    } else if (user.role === "participante") {
      if (fromPath && typeof fromPath === "string") {
        navigate(fromPath, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, fromPath]);

  if (isLoading) return <LoadingScreen />;

  return (
    <Layout>
      <div className="container max-w-md py-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <CardDescription>Faça login para acessar sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" />
                      Entrando...
                    </span>
                  ) : (
                    "Entrar"
                  )}
                </Button>
                </form>
                </Form>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground flex flex-col gap-2">
            <span>
              Não tem conta?{" "}
              <span
                className="text-primary underline cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Cadastre-se
              </span>
            </span>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
