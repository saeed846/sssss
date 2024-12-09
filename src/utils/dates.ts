import { addMonths as addMonthsDateFns } from 'date-fns';

export const addMonths = (date: Date, months: number): Date => {
  return addMonthsDateFns(date, months);
};

export const isExpired = (expiresAt: Date): boolean => {
  return new Date() > new Date(expiresAt);
};

export const getRemainingDays = (expiresAt: Date): number => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};