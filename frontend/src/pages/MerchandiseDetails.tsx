/*
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMerchandiseById } from "@/services/merchandiseService";
import { Merchandise } from "@/types/merchandise";
import { useCart } from "@/contexts/CartContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, ArrowLeft } from "lucide-react";

const MerchandiseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [merchandise, setMerchandise] = useState<Merchandise | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchMerchandise = async () => {
      setLoading(true);
      const data = getMerchandiseById(id);
      if (data) {
        setMerchandise(data);
        setMainImage(data.images[0]);
        
        // Set default selections
        const availableSize = data.sizes.find(size => size.available);
        if (availableSize) setSelectedSize(availableSize.value);
        
        const availableColor = data.colors.find(color => color.available);
        if (availableColor) setSelectedColor(availableColor.value);
      }
      setLoading(false);
    };

    fetchMerchandise();
  }, [id]);

  const handleAddToCart = () => {
    if (!merchandise || !selectedSize || !selectedColor) return;
    
    addItem({
      merchandiseId: merchandise.id,
      name: merchandise.name,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      price: merchandise.price,
      image: merchandise.images[0]
    });

    navigate("/carrinho");
  };

  if (loading) {
    return (
      <Layout>
        <div className="container flex items-center justify-center py-12">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4">Carregando produto...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!merchandise) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h2 className="text-2xl font-bold">Produto não encontrado</h2>
          <p className="text-muted-foreground mt-2">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <Button asChild className="mt-8">
            <Link to="/loja">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para a loja
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/loja">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a loja
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product images }
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
              <img
                src={mainImage}
                alt={merchandise.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            {merchandise.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {merchandise.images.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-square cursor-pointer rounded-md overflow-hidden border-2 ${
                      mainImage === image ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setMainImage(image)}
                  >
                    <img
                      src={image}
                      alt={`${merchandise.name} - imagem ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product details }
          <div>
            <h1 className="text-3xl font-bold">{merchandise.name}</h1>
            <div className="mt-2 text-2xl font-medium text-primary">
              R$ {merchandise.price.toFixed(2)}
            </div>

            <Separator className="my-6" />

            <div className="prose prose-sm mt-4">
              <p>{merchandise.description}</p>
            </div>

            <div className="mt-8 space-y-6">
              {/* Size selection }
              <div>
                <h3 className="font-medium mb-3">Tamanho</h3>
                <RadioGroup 
                  value={selectedSize} 
                  onValueChange={setSelectedSize}
                  className="flex flex-wrap gap-3"
                >
                  {merchandise.sizes.map((size) => (
                    <div key={size.value} className="flex items-center">
                      <RadioGroupItem
                        value={size.value}
                        id={`size-${size.value}`}
                        disabled={!size.available}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`size-${size.value}`}
                        className="rounded-md border-2 px-4 py-2 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-disabled:bg-muted peer-data-[state=checked]:border-primary"
                      >
                        {size.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Color selection }
              <div>
                <h3 className="font-medium mb-3">Cor</h3>
                <RadioGroup 
                  value={selectedColor} 
                  onValueChange={setSelectedColor}
                  className="flex flex-wrap gap-3"
                >
                  {merchandise.colors.map((color) => (
                    <div key={color.value} className="flex items-center">
                      <RadioGroupItem
                        value={color.value}
                        id={`color-${color.value}`}
                        disabled={!color.available}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`color-${color.value}`}
                        className="flex items-center gap-2 rounded-md border-2 px-4 py-2 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-[state=checked]:border-primary"
                      >
                        <span 
                          className="h-4 w-4 rounded-full block" 
                          style={{ backgroundColor: color.hex }}
                        ></span>
                        {color.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Quantity }
              <div>
                <h3 className="font-medium mb-3">Quantidade</h3>
                <div className="flex items-center w-32">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-r-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-l-none"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add to cart button }
              <Button 
                size="lg" 
                className="w-full mt-8"
                disabled={!merchandise.inStock || !selectedSize || !selectedColor}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {merchandise.inStock ? "Adicionar ao carrinho" : "Produto esgotado"}
              </Button>

              {/* Event relation if present }
              {merchandise.eventRelated && (
                <Card className="p-4 mt-6">
                  <p className="font-medium">Camiseta de evento</p>
                  <p className="text-sm text-muted-foreground">
                    Este produto está relacionado a um evento específico.
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-2" asChild>
                    <Link to={`/comprar/${merchandise.eventRelated}`}>
                      Ver o evento relacionado
                    </Link>
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MerchandiseDetails;
*/