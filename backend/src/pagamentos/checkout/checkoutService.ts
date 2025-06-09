// backend/src/pagamentos/services/checkoutService.ts

import { createPreferenceIntegration } from "./checkoutIntegration";

export async function createPreferenceService(payload: any) {
  // Aqui você pode fazer validações, mapear campos, salvar registro se quiser
  // Normalmente só repassa para a integração:
  return await createPreferenceIntegration(payload);
}
