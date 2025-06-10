import { useEffect, useState } from "react";
import MerchandiseCard from "@/components/MerchandiseCard";
import { getAllMerchandise } from "@/services/merchandiseService";
import { Merchandise } from "@/types/merchandise";
import { Link } from "react-router-dom";

const MerchandiseSection = () => {
  const [featuredMerchandise, setFeaturedMerchandise] = useState<Merchandise[]>([]);

  useEffect(() => {
    const fetchMerchandise = async () => {
      const allMerchandise = await getAllMerchandise();
      const featured = allMerchandise.slice(0, 4);
      setFeaturedMerchandise(featured);
    };
    fetchMerchandise();
  }, []);

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Camisetas Oficiais</h2>
            <p className="text-muted-foreground mt-1">
              Adquira camisetas exclusivas da Associação Palestra de Descalvado
            </p>
          </div>
          <Link to="/loja" className="text-primary hover:underline mt-2 md:mt-0">
            Ver toda a coleção →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMerchandise.map((item) => (
            <MerchandiseCard key={item.id} merchandise={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MerchandiseSection;
