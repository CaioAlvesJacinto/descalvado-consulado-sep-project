
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const Unauthorized = () => {
  return (
    <Layout>
      <div className="container max-w-md py-12 text-center">
        <div className="rounded-full bg-amber-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Acesso Não Autorizado</h1>
        <p className="text-muted-foreground mb-6">
          Você não tem permissão para acessar esta página. Por favor, contate o administrador
          se acredita que isso é um erro.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild variant="default">
            <Link to="/">Voltar ao Início</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/login">Fazer Login</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized;
