import { supabase } from "@/integrations/supabase/supabaseClient";
console.log("SUPABASE SERVICE", !!supabase);
import { Merchandise } from "@/types/merchandise";

/* ------------------------------------------------------------------ */
/* READ – Lista todos os produtos                                     */
/* ------------------------------------------------------------------ */
export async function getAllMerchandise(): Promise<Merchandise[]> {
  const { data, error } = await supabase
    .from("merchandise")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllMerchandise →", error);
    return [];
  }

  return (data ?? []) as Merchandise[];
}

/* ------------------------------------------------------------------ */
/* READ – Lista produtos por evento                                   */
/* ------------------------------------------------------------------ */
export async function getMerchandiseByEvent(eventId: string): Promise<Merchandise[]> {
  const { data, error } = await supabase
    .from("merchandise")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getMerchandiseByEvent →", error);
    return [];
  }

  return (data ?? []) as Merchandise[];
}

/* ------------------------------------------------------------------ */
/* READ – Produtos em destaque                                        */
/* ------------------------------------------------------------------ */
export async function getFeaturedMerchandise(): Promise<Merchandise[]> {
  const { data, error } = await supabase
    .from("merchandise")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getFeaturedMerchandise →", error);
    return [];
  }

  return (data ?? []) as Merchandise[];
}

/* ------------------------------------------------------------------ */
/* READ – Estatísticas de merchandise                                 */
/* ------------------------------------------------------------------ */
export async function getMerchandiseStats() {
  const { count, error } = await supabase
    .from("merchandise")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("getMerchandiseStats →", error);
    return { total: 0 };
  }

  return { total: count ?? 0 };
}

/* ------------------------------------------------------------------ */
/* READ – Categorias únicas                                           */
/* ------------------------------------------------------------------ */
export async function getMerchandiseCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("merchandise")
    .select("category");

  if (error) {
    console.error("getMerchandiseCategories →", error);
    return [];
  }

  const uniqueCategories = Array.from(new Set(data?.map((item) => item.category)));
  return uniqueCategories;
}

/* ------------------------------------------------------------------ */
/* READ – Busca por ID                                                */
/* ------------------------------------------------------------------ */
export async function getMerchandiseById(id: string): Promise<Merchandise | null> {
  const { data, error } = await supabase
    .from("merchandise")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getMerchandiseById →", error);
    return null;
  }

  return data as Merchandise;
}

/* ------------------------------------------------------------------ */
/* CREATE                                                             */
/* ------------------------------------------------------------------ */
export async function createMerchandise(
  payload: Omit<Merchandise, "id" | "created_at" | "updated_at">
): Promise<Merchandise> {
  const { data, error } = await supabase
    .from("merchandise")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as Merchandise;
}

/* ------------------------------------------------------------------ */
/* UPDATE                                                             */
/* ------------------------------------------------------------------ */
export async function updateMerchandise(
  id: string,
  payload: Partial<Merchandise>
): Promise<Merchandise> {
  const { data, error } = await supabase
    .from("merchandise")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Merchandise;
}

/* ------------------------------------------------------------------ */
/* DELETE                                                             */
/* ------------------------------------------------------------------ */
export async function deleteMerchandise(id: string): Promise<boolean> {
  const { error } = await supabase.from("merchandise").delete().eq("id", id);
  if (error) {
    console.error("deleteMerchandise →", error);
    return false;
  }
  return true;
}
