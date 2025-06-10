
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t py-8 mt-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/lovable-uploads/c5477e83-6b1e-483b-8640-5b3b7c470d53.png" 
                alt="Logo do Consulado Palmeiras de Descalvado"
                className="h-8 w-auto"
              />
              <h3 className="font-semibold text-lg">
                Consulado de Descalvado<span className="text-primary"> - SEP</span>
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Plataforma oficial de venda de ingressos para eventos beneficentes do Consulado Palmeiras de Descalvado.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="text-muted-foreground hover:text-foreground">
                  Eventos
                </Link>
              </li>
              <li>
                <Link to="/validate" className="text-muted-foreground hover:text-foreground">
                  Validar Ingresso
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Contato</h4>
            <p className="text-sm text-muted-foreground">
              Consulado Palmeiras de Descalvado
              <br />
              Descalvado - SP
              <br />
              contato@consultadodescalvado.org
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Consulado de Descalvado - SEP. Todos os direitos reservados. <br />
          <span className="text-xs">Plataforma oficial do Consulado Palmeiras de Descalvado</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
