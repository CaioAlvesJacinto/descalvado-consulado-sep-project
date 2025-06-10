
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="rounded-xl bg-gradient-to-r from-primary to-secondary p-8 md:p-12 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Faça parte dos eventos do Consulado
            </h2>
            <p className="text-white/90 mb-6 max-w-[600px]">
              Adquira seu ingresso hoje mesmo e participe dos eventos do 
              Consulado Palmeiras de Descalvado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/eventos">Comprar Ingressos</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/20 text-white border-white/40 hover:bg-white/30" asChild>
                <Link to="/loja">Ver Nossa Loja</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
