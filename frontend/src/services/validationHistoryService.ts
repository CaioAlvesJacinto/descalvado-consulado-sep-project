import { ValidationRecord, TicketInfo } from "@/types/ticket";

const STORAGE_KEY = 'validation_history';

/**
 * Salva um registro de validação no localStorage
 */
export const saveValidationRecord = (
  ticketInfo: TicketInfo, 
  validatorId: string, 
  validatorName: string,
  status: 'valid' | 'invalid' | 'used' | 'expired'
): ValidationRecord => {
  const record: ValidationRecord = {
    id: `validation-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    ticketId: ticketInfo.id,
    eventId: ticketInfo.id.split('-')[0] || 'unknown', // ajuste se tiver eventId real
    eventName: ticketInfo.eventName,
    participantName: ticketInfo.holderName,
    validatedAt: new Date().toLocaleString(),
    validatedBy: validatorId,
    validatorName: validatorName,
    ticketNumber: ticketInfo.ticketNumber,
    status
  };

  // Salva no localStorage (mantém últimos 1000 registros)
  const existingRecords = getValidationHistory();
  const updatedRecords = [record, ...existingRecords].slice(0, 1000);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

  return record;
};

/**
 * Recupera o histórico de validações
 */
export const getValidationHistory = (): ValidationRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading validation history:', error);
    return [];
  }
};

/**
 * Filtra histórico por colaborador
 */
export const getValidationHistoryByValidator = (validatorId: string): ValidationRecord[] => {
  return getValidationHistory().filter(record => record.validatedBy === validatorId);
};

/**
 * Filtra histórico por evento
 */
export const getValidationHistoryByEvent = (eventId: string): ValidationRecord[] => {
  return getValidationHistory().filter(record => record.eventId === eventId);
};

/**
 * Filtra histórico por data
 */
export const getValidationHistoryByDateRange = (startDate: Date, endDate: Date): ValidationRecord[] => {
  return getValidationHistory().filter(record => {
    const recordDate = new Date(record.validatedAt);
    return recordDate >= startDate && recordDate <= endDate;
  });
};

/**
 * Limpa histórico antigo (mais de 30 dias)
 */
export const cleanOldValidationHistory = (): void => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentRecords = getValidationHistory().filter(record => {
    const recordDate = new Date(record.validatedAt);
    return recordDate >= thirtyDaysAgo;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(recentRecords));
};
