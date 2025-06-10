import { getFeaturedEvents } from "../src/services/eventService";

(async () => {
  try {
    const result = await getFeaturedEvents();
    console.log("Resultado direto do getFeaturedEvents:", result);
    console.log("Tipo de retorno:", typeof result);
    console.log("É array?", Array.isArray(result));
  } catch (err) {
    console.error("Erro no teste isolado do getFeaturedEvents:", err);
  }
})();
