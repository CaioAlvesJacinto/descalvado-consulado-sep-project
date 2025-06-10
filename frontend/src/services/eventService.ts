// src/services/eventService.ts
import { supabase } from "@/integrations/supabase/supabaseClient";
import type { Event } from "@/types/event";
/* ------------------------------------------------------------------ */
/* READ — lista todos os eventos                                      */
/* ------------------------------------------------------------------ */
export async function getAllEvents(): Promise<Event[]> {
  const { data, error, status } = await supabase
    .from("events")
    .select("*")
    .order("start_datetime", { ascending: true });

  if (error) {
    console.error("getAllEvents →", status, error.message);
    return [];
  }

  // DEBUG: veja o que realmente vem!
  console.log("Retorno do getAllEvents do Supabase:", data);

  return (data ?? []) as Event[];
}


/* ------------------------------------------------------------------ */
/* READ — evento por ID                                               */
/* ------------------------------------------------------------------ */
export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getEventById →", error.message);
    return null;
  }

  return data as Event;
}

/* ------------------------------------------------------------------ */
/* READ — eventos em destaque                                         */
/*                                                                     
   Se não houver coluna `featured` ou ocorrer erro, devolve `[]`.    */
/* ------------------------------------------------------------------ */
// src/services/eventService.ts



export async function getFeaturedEvents(): Promise<Event[]> {
  // 1) dispara a consulta
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("featured", true)
    .order("start_datetime", { ascending: true });

  // 2) se deu erro, loga e devolve Array vazio
  if (error) {
    console.error("getFeaturedEvents →", error.message);
    return [];
  }

  // 3) se data for array, devolve ele. Se não, devolve []
  return Array.isArray(data) ? (data as Event[]) : [];
}


/* ------------------------------------------------------------------ */
/* READ — categorias únicas                                           */
/* ------------------------------------------------------------------ */
export async function getEventCategories(): Promise<string[]> {
  // `data` virá como [{ category: "show" }, { category: "curso" }, …]
  const { data, error } = await supabase
    .from("events")
    .select("category");

  if (error) {
    console.error("getEventCategories →", error.message);
    return [];
  }

  const rows = (data ?? []) as { category: string }[];
  return Array.from(new Set(rows.map((e) => e.category)));
}

/* ------------------------------------------------------------------ */
/* READ — busca texto (title / category)                              */
/* ------------------------------------------------------------------ */
export async function searchEvents(query: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .or(`title.ilike.%${query}%,category.ilike.%${query}%`);

  if (error) {
    console.error("searchEvents →", error.message);
    return [];
  }

  return (data ?? []) as Event[];
}

/* ------------------------------------------------------------------ */
/* READ — estatísticas rápidas                                        */
/* ------------------------------------------------------------------ */
export async function getEventStats(): Promise<{ total: number }> {
  const { count, error } = await supabase
    .from("events")
    .select("*", { head: true, count: "exact" });

  if (error) {
    console.error("getEventStats →", error.message);
    return { total: 0 };
  }

  return { total: count ?? 0 };
}

/* ------------------------------------------------------------------ */
/* CREATE                                                             */
/* ------------------------------------------------------------------ */
export async function createEvent(event: Omit<Event, "id">): Promise<Event> {
  const { data, error } = await supabase
    .from("events")
    .insert(event)
    .select("*")
    .single();

  if (error) {
    console.error("createEvent →", error.message);
    throw error;
  }

  return data as Event;
}

/* ------------------------------------------------------------------ */
/* UPDATE                                                             */
/* ------------------------------------------------------------------ */
export async function updateEvent(
  id: string,
  updates: Partial<Event>
): Promise<Event> {
  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("updateEvent →", error.message);
    throw error;
  }

  return data as Event;
}

/* ------------------------------------------------------------------ */
/* DELETE                                                             */
/* ------------------------------------------------------------------ */
export async function deleteEvent(id: string): Promise<boolean> {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    console.error("deleteEvent →", error.message);
    return false;
  }
  return true;
}

/**
 * Retorna os eventos ativos para o colaborador (eventos futuros ou de hoje)
 */
export async function getActiveEvents(): Promise<Event[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("start_datetime", now)
    .order("start_datetime", { ascending: true });

  if (error) {
    console.error("getActiveEvents →", error.message);
    return [];
  }

  return (data ?? []) as Event[];
}