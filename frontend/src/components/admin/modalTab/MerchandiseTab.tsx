import { Button } from "@/components/ui/button";
import MerchandiseStats from "@/components/admin/merchandise/MerchandiseStats";
import MerchandiseTable from "@/components/admin/merchandise/MerchandiseTable";
import { Merchandise } from "@/types/merchandise";

interface MerchandiseTabProps {
  products: Merchandise[];
  onRefresh: () => void;
}

export default function MerchandiseTab({ products, onRefresh }: MerchandiseTabProps) {
  return (
    <div className="space-y-4">
      <MerchandiseStats products={products} />
      <MerchandiseTable products={products} />
      <Button onClick={onRefresh}>Atualizar Estoque</Button>
    </div>
  );
}
