
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import MerchandiseCard from "@/components/MerchandiseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAllMerchandise, getMerchandiseCategories } from "@/services/merchandiseService";
import { Merchandise as MerchandiseType } from "@/types/merchandise";

const Merchandise = () => {
  const [merchandise, setMerchandise] = useState<MerchandiseType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(() => {
    // Load merchandise and categories
    const allMerchandise = getAllMerchandise();
    setMerchandise(allMerchandise);
    setCategories(getMerchandiseCategories());
  }, []);

  // Filter merchandise based on search query and category
  const filteredMerchandise = merchandise.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = currentCategory === "all" || item.category === currentCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <section className="container px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loja Oficial</h1>
            <p className="text-muted-foreground mt-1">
              Camisetas exclusivas do Consulado de Descalvado
            </p>
          </div>
          <div className="w-full md:w-auto">
            <Input
              placeholder="Buscar camisetas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-[300px]"
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={currentCategory} onValueChange={setCurrentCategory}>
          <TabsList className="mb-8">
            <TabsTrigger value="all">Todos</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMerchandise.map((item) => (
                <MerchandiseCard key={item.id} merchandise={item} />
              ))}
            </div>
            {filteredMerchandise.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar sua busca ou filtros
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Limpar busca
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMerchandise.map((item) => (
                  <MerchandiseCard key={item.id} merchandise={item} />
                ))}
              </div>
              {filteredMerchandise.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar sua busca ou filtros
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentCategory("all");
                    }}
                  >
                    Ver todos os produtos
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </Layout>
  );
};

export default Merchandise;
